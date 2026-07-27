import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import databaseService from './database.service'
import GradeItem, { GradeItemType, RubricCriterion } from '~/models/schemas/gradeItems.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

const MATERIAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'assignment-materials')

class GradeItemsService {
  private validateAndNormalizeRubric(rubric: unknown, maxScore: number): RubricCriterion[] {
    if (!Array.isArray(rubric)) {
      throw new ErrorWithStatus({
        message: 'Rubric must be an array',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const normalized = rubric.map((item: any, index) => {
      const id = String(item?.id || '').trim()
      const name = String(item?.name || '').trim()
      const description = String(item?.description || '').trim()
      const maxPoints = Number(item?.maxPoints)
      const evidenceRequirements = Array.isArray(item?.evidenceRequirements)
        ? item.evidenceRequirements.map((value: unknown) => String(value).trim()).filter(Boolean)
        : []

      if (!id || !name || !description || !Number.isFinite(maxPoints) || maxPoints <= 0) {
        throw new ErrorWithStatus({
          message: `Rubric criterion ${index + 1} requires id, name, description and maxPoints greater than 0`,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      return { id, name, description, maxPoints, evidenceRequirements }
    })

    if (new Set(normalized.map(item => item.id)).size !== normalized.length) {
      throw new ErrorWithStatus({
        message: 'Rubric criterion ids must be unique',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const rubricTotal = normalized.reduce((sum, item) => sum + item.maxPoints, 0)
    if (normalized.length > 0 && Math.abs(rubricTotal - maxScore) > 0.001) {
      throw new ErrorWithStatus({
        message: `Rubric maximum points (${rubricTotal}) must equal grade item maxScore (${maxScore})`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return normalized
  }

  async createGradeItem(classId: string, payload: any) {
    const maxScore = Number(payload.maxScore ?? 10)
    if (!Number.isFinite(maxScore) || maxScore <= 0) {
      throw new ErrorWithStatus({ message: 'maxScore must be greater than 0', status: HTTP_STATUS.BAD_REQUEST })
    }
    const rubric = payload.rubric === undefined ? [] : this.validateAndNormalizeRubric(payload.rubric, maxScore)
    let finalSessionId = payload.sessionId ? new ObjectId(payload.sessionId) : undefined;
    
    // If we are applying to a different class, we need to map the session by sessionNo
    if (payload.sessionId) {
      const originalSession = await databaseService.sessions.findOne({ _id: new ObjectId(payload.sessionId) });
      if (originalSession && originalSession.classId.toHexString() !== classId) {
        // Find the corresponding session in the target class
        const targetSession = await databaseService.sessions.findOne({ 
          classId: new ObjectId(classId), 
          sessionNo: originalSession.sessionNo 
        });
        if (targetSession) {
          finalSessionId = targetSession._id;
        } else {
          finalSessionId = undefined; // Do not cross-link to original class's session
        }
      }
    }

    const newGradeItem = new GradeItem({
      ...payload,
      maxScore,
      rubric,
      classId: new ObjectId(classId),
      ...(finalSessionId && { sessionId: finalSessionId })
    })
    const result = await databaseService.gradeItems.insertOne(newGradeItem)
    return { ...newGradeItem, _id: result.insertedId }
  }

  async getGradeItemsByClassId(classId: string) {
    const items = await databaseService.gradeItems.find({ classId: new ObjectId(classId) }).toArray()
    return items
  }

  async getGradeItemById(id: string) {
    const item = await databaseService.gradeItems.findOne({ _id: new ObjectId(id) })
    return item
  }

  async updateGradeItem(id: string, payload: Partial<GradeItemType>) {
    const existingItem = await this.getGradeItemById(id)
    if (!existingItem) return null

    const updatePayload: any = { ...payload }
    if (updatePayload.sessionId) {
      updatePayload.sessionId = new ObjectId(updatePayload.sessionId)
    }
    const maxScore = Number(updatePayload.maxScore ?? existingItem.maxScore ?? 10)
    if (!Number.isFinite(maxScore) || maxScore <= 0) {
      throw new ErrorWithStatus({ message: 'maxScore must be greater than 0', status: HTTP_STATUS.BAD_REQUEST })
    }
    if (updatePayload.rubric !== undefined || updatePayload.maxScore !== undefined) {
      updatePayload.maxScore = maxScore
      updatePayload.rubric = this.validateAndNormalizeRubric(
        updatePayload.rubric ?? existingItem.rubric ?? [],
        maxScore
      )
    }

    const result = await databaseService.gradeItems.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updatePayload,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteGradeItem(id: string) {
    const result = await databaseService.gradeItems.findOneAndDelete({ _id: new ObjectId(id) })
    return result
  }

  // Materials for GradeItems
  async listMaterials(gradeItemId: string, user: any) {
    return databaseService.assignmentMaterials
      .find({ assignmentId: new ObjectId(gradeItemId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async uploadMaterial(gradeItemId: string, file: UploadedAssignmentMaterialFile, body: any, user: any) {
    const gradeItem = await this.getGradeItemById(gradeItemId)
    if (!gradeItem) {
      throw new ErrorWithStatus({
        message: 'Grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (!fs.existsSync(MATERIAL_UPLOAD_DIR)) {
      fs.mkdirSync(MATERIAL_UPLOAD_DIR, { recursive: true })
    }

    const ext = path.extname(file.originalFilename).toLowerCase()
    const storedFilename = `${gradeItem._id!.toString()}-${Date.now()}-${new ObjectId().toString()}${ext}`
    const storedPath = path.join(MATERIAL_UPLOAD_DIR, storedFilename)
    fs.renameSync(file.filepath, storedPath)

    const material = {
      assignmentId: gradeItem._id, // we reuse assignmentId for backward compatibility in the db collection
      classId: gradeItem.classId,
      sessionId: gradeItem.sessionId,
      title: body.title || file.originalFilename,
      description: body.description || '',
      originalFilename: file.originalFilename,
      storedFilename,
      filepath: storedPath,
      mimetype: file.mimetype,
      size: file.size,
      contentHash: file.contentHash,
      uploadedBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await databaseService.assignmentMaterials.insertOne(material)
    return { ...material, _id: result.insertedId }
  }

  async getMaterialForDownload(materialId: string, user: any) {
    const material = await databaseService.assignmentMaterials.findOne({ _id: new ObjectId(materialId) })
    if (!material) {
      throw new ErrorWithStatus({
        message: 'Material not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (!fs.existsSync(material.filepath)) {
      throw new ErrorWithStatus({
        message: 'Material file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return material
  }

  async deleteMaterial(materialId: string, user: any) {
    const material = await databaseService.assignmentMaterials.findOne({ _id: new ObjectId(materialId) })
    if (!material) {
      throw new ErrorWithStatus({
        message: 'Material not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (fs.existsSync(material.filepath)) {
      fs.unlinkSync(material.filepath)
    }

    return databaseService.assignmentMaterials.findOneAndDelete({ _id: material._id })
  }
}

const gradeItemsService = new GradeItemsService()
export default gradeItemsService
