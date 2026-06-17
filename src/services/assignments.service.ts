import fs from 'fs'
import path from 'path'
import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import Assignment, { AssignmentType } from '~/models/schemas/assignments.schema'
import {
  CreateAssignmentReqBody,
  UpdateAssignmentReqBody,
  UploadedAssignmentMaterialFile
} from '~/models/requests/assignments.request'

const MATERIAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'assignment-materials')

class AssignmentsService {
  private toObjectId(id: string, label: string) {
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        message: `Invalid ${label}`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return new ObjectId(id)
  }

  private normalizeNumber(value: unknown, fallback: number) {
    if (value === undefined || value === null || value === '') return fallback
    const numberValue = Number(value)
    if (Number.isNaN(numberValue)) {
      throw new ErrorWithStatus({
        message: 'Numeric assignment fields must be valid numbers',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return numberValue
  }

  private normalizeBoolean(value: unknown, fallback: boolean) {
    if (value === undefined || value === null || value === '') return fallback
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    return Boolean(value)
  }

  private async getSessionOrFail(sessionId: string) {
    const sessionOid = this.toObjectId(sessionId, 'sessionId')
    const session = await databaseService.sessions.findOne({ _id: sessionOid })
    if (!session) {
      throw new ErrorWithStatus({
        message: 'Session not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return session
  }

  private async getClassOrFail(classId: ObjectId) {
    const cls = await databaseService.classes.findOne({ _id: classId })
    if (!cls) {
      throw new ErrorWithStatus({
        message: 'Class not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return cls
  }

  private isLecturerOfClass(userId: ObjectId, cls: any) {
    return (
      cls.lecturerId?.toString() === userId.toString() ||
      cls.lecturer?.lecturerId?.toString() === userId.toString()
    )
  }

  private async ensureCanAccessClass(user: any, classId: ObjectId) {
    const cls = await this.getClassOrFail(classId)

    if (user.role === 'ADMIN' || user.role === 'SUBJECT_HEAD') return cls
    if (user.role === 'LECTURER' && this.isLecturerOfClass(user._id, cls)) return cls

    if (user.role === 'STUDENT') {
      const enrollment = await databaseService.classMembers.findOne({
        studentId: user._id,
        classId,
        status: 'active'
      })
      const isSnapshotStudent = cls.students?.some((student: any) => student.studentId?.toString() === user._id.toString())
      if (enrollment || isSnapshotStudent) return cls
    }

    throw new ErrorWithStatus({
      message: 'You do not have permission to access this class',
      status: HTTP_STATUS.FORBIDDEN
    })
  }

  private async ensureLecturerCanManageClass(user: any, classId: ObjectId) {
    const cls = await this.getClassOrFail(classId)

    if (user.role === 'ADMIN') return cls
    if (user.role === 'LECTURER' && this.isLecturerOfClass(user._id, cls)) return cls

    throw new ErrorWithStatus({
      message: 'Lecturer is not assigned to this class',
      status: HTTP_STATUS.FORBIDDEN
    })
  }

  private buildAssignmentPayload(payload: CreateAssignmentReqBody | UpdateAssignmentReqBody) {
    const update: Record<string, unknown> = {}

    if (payload.title !== undefined) update.title = String(payload.title).trim()
    if (payload.description !== undefined) update.description = String(payload.description || '')
    if (payload.instructions !== undefined) update.instructions = String(payload.instructions || '')
    if (payload.deadline !== undefined) {
      const deadline = new Date(payload.deadline)
      if (Number.isNaN(deadline.getTime())) {
        throw new ErrorWithStatus({
          message: 'Deadline must be a valid datetime',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      update.deadline = deadline
    }
    if (payload.maxScore !== undefined) update.maxScore = this.normalizeNumber(payload.maxScore, 10)
    if (payload.weight !== undefined) update.weight = this.normalizeNumber(payload.weight, 0)
    if (payload.aiDeclarationRequired !== undefined) {
      update.aiDeclarationRequired = this.normalizeBoolean(payload.aiDeclarationRequired, true)
    }
    if (payload.minAiInteractions !== undefined) {
      update.minAiInteractions = this.normalizeNumber(payload.minAiInteractions, 5)
    }
    if (payload.maxAiInteractions !== undefined) {
      update.maxAiInteractions = this.normalizeNumber(payload.maxAiInteractions, 10)
    }
    if (payload.allowResubmission !== undefined) {
      update.allowResubmission = this.normalizeBoolean(payload.allowResubmission, true)
    }

    if (update.title === '') {
      throw new ErrorWithStatus({
        message: 'Assignment title is required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return update
  }

  private visibleAssignmentFilter(user: any): Partial<Pick<Assignment, 'status' | 'isPublished'>> {
    if (user.role === 'STUDENT') {
      return { status: 'published', isPublished: true }
    }
    return {}
  }

  async createAssignment(sessionId: string, payload: CreateAssignmentReqBody, user: any) {
    const session = await this.getSessionOrFail(sessionId)
    const classId = session.classId as ObjectId
    await this.ensureLecturerCanManageClass(user, classId)

    const normalized = this.buildAssignmentPayload(payload)
    if (!normalized.title || !normalized.deadline) {
      throw new ErrorWithStatus({
        message: 'Assignment title and deadline are required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const assignment = new Assignment({
      ...(normalized as Omit<AssignmentType, 'sessionId' | 'classId' | 'createdBy'>),
      sessionId: session._id,
      classId,
      createdBy: user._id
    })

    const result = await databaseService.assignments.insertOne(assignment)
    return { ...assignment, _id: result.insertedId }
  }

  async listAssignmentsByClass(classId: string, user: any) {
    const classOid = this.toObjectId(classId, 'classId')
    await this.ensureCanAccessClass(user, classOid)

    return databaseService.assignments
      .find({ classId: classOid, ...this.visibleAssignmentFilter(user) })
      .sort({ deadline: 1, createdAt: -1 })
      .toArray()
  }

  async listAssignmentsBySession(sessionId: string, user: any) {
    const session = await this.getSessionOrFail(sessionId)
    await this.ensureCanAccessClass(user, session.classId as ObjectId)

    return databaseService.assignments
      .find({ sessionId: session._id, ...this.visibleAssignmentFilter(user) })
      .sort({ deadline: 1, createdAt: -1 })
      .toArray()
  }

  async getAssignmentById(id: string, user: any) {
    const assignment = await databaseService.assignments.findOne({ _id: this.toObjectId(id, 'assignmentId') })
    if (!assignment) {
      throw new ErrorWithStatus({
        message: 'Assignment not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.ensureCanAccessClass(user, assignment.classId as ObjectId)
    if (user.role === 'STUDENT' && (!assignment.isPublished || assignment.status !== 'published')) {
      throw new ErrorWithStatus({
        message: 'Assignment not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return assignment
  }

  async updateAssignment(id: string, payload: UpdateAssignmentReqBody, user: any) {
    const assignment = await this.getAssignmentById(id, user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    const normalized = this.buildAssignmentPayload(payload)
    const result = await databaseService.assignments.findOneAndUpdate(
      { _id: assignment._id },
      {
        $set: {
          ...normalized,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async deleteAssignment(id: string, user: any) {
    const assignment = await this.getAssignmentById(id, user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    const submissionsCount = await databaseService.submissions.countDocuments({
      $or: [{ assignmentId: assignment._id }, { gradeItemId: assignment._id }]
    })
    if (submissionsCount > 0) {
      throw new ErrorWithStatus({
        message: 'Cannot delete assignment that already has submissions',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.assignmentMaterials.deleteMany({ assignmentId: assignment._id })
    return databaseService.assignments.findOneAndDelete({ _id: assignment._id })
  }

  async publishAssignment(id: string, user: any) {
    const assignment = await this.getAssignmentById(id, user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    if (new Date(assignment.deadline as Date) <= new Date()) {
      throw new ErrorWithStatus({
        message: 'Deadline must be greater than current datetime when publishing',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const now = new Date()
    const result = await databaseService.assignments.findOneAndUpdate(
      { _id: assignment._id },
      {
        $set: {
          status: 'published',
          isPublished: true,
          publishedAt: now,
          closedAt: null,
          updatedAt: now
        }
      },
      { returnDocument: 'after' }
    )

    await this.createAssignmentNotification(assignment, 'assignment_published')
    return result
  }

  async closeAssignment(id: string, user: any) {
    const assignment = await this.getAssignmentById(id, user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    const now = new Date()
    return databaseService.assignments.findOneAndUpdate(
      { _id: assignment._id },
      {
        $set: {
          status: 'closed',
          isPublished: false,
          closedAt: now,
          updatedAt: now
        }
      },
      { returnDocument: 'after' }
    )
  }

  async listMaterials(assignmentId: string, user: any) {
    const assignment = await this.getAssignmentById(assignmentId, user)
    return databaseService.assignmentMaterials
      .find({ assignmentId: assignment._id })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async uploadMaterial(assignmentId: string, file: UploadedAssignmentMaterialFile, body: any, user: any) {
    const assignment = await this.getAssignmentById(assignmentId, user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    if (!fs.existsSync(MATERIAL_UPLOAD_DIR)) {
      fs.mkdirSync(MATERIAL_UPLOAD_DIR, { recursive: true })
    }

    const ext = path.extname(file.originalFilename).toLowerCase()
    const storedFilename = `${assignment._id!.toString()}-${Date.now()}-${new ObjectId().toString()}${ext}`
    const storedPath = path.join(MATERIAL_UPLOAD_DIR, storedFilename)
    fs.renameSync(file.filepath, storedPath)

    const material = {
      assignmentId: assignment._id,
      classId: assignment.classId,
      sessionId: assignment.sessionId,
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
    const material = await databaseService.assignmentMaterials.findOne({ _id: this.toObjectId(materialId, 'materialId') })
    if (!material) {
      throw new ErrorWithStatus({
        message: 'Material not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.getAssignmentById((material.assignmentId as ObjectId).toString(), user)
    if (!fs.existsSync(material.filepath)) {
      throw new ErrorWithStatus({
        message: 'Material file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return material
  }

  async deleteMaterial(materialId: string, user: any) {
    const material = await databaseService.assignmentMaterials.findOne({ _id: this.toObjectId(materialId, 'materialId') })
    if (!material) {
      throw new ErrorWithStatus({
        message: 'Material not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const assignment = await this.getAssignmentById((material.assignmentId as ObjectId).toString(), user)
    await this.ensureLecturerCanManageClass(user, assignment.classId as ObjectId)

    if (fs.existsSync(material.filepath)) {
      fs.unlinkSync(material.filepath)
    }

    return databaseService.assignmentMaterials.findOneAndDelete({ _id: material._id })
  }

  private async createAssignmentNotification(assignment: any, type: string) {
    const classMembers = await databaseService.classMembers
      .find({ classId: assignment.classId, status: 'active' })
      .project({ studentId: 1, _id: 0 })
      .toArray()

    const recipients = classMembers.map((member: any) => member.studentId).filter(Boolean)
    if (recipients.length === 0) return

    const now = new Date()
    await databaseService.notifications.insertOne({
      type: type as any,
      title: 'New assignment published',
      message: assignment.title,
      classId: assignment.classId,
      assignmentId: assignment._id,
      recipientIds: recipients,
      isRead: false,
      createdAt: now
    })

    await databaseService.emailLogs.insertOne({
      type: type as any,
      subject: 'New assignment published',
      recipientIds: recipients,
      payload: {
        assignmentId: assignment._id,
        title: assignment.title
      },
      status: 'queued',
      createdAt: now
    })
  }
}

const assignmentsService = new AssignmentsService()
export default assignmentsService
