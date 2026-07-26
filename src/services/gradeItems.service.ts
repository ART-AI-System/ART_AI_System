import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import databaseService from './database.service'
import GradeItem, { GradeItemType } from '~/models/schemas/gradeItems.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

const MATERIAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'assignment-materials')

class GradeItemsService {
  async createGradeItem(classId: string, payload: any) {
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
      classId: new ObjectId(classId),
      ...(finalSessionId && { sessionId: finalSessionId })
    })
    const result = await databaseService.gradeItems.insertOne(newGradeItem)
    return { ...newGradeItem, _id: result.insertedId }
  }

  async importTest(classId: string, payload: any) {
    const mammoth = require('mammoth');
    const cheerio = require('cheerio');
    
    const result = await mammoth.convertToHtml({ path: payload.file.filepath });
    const html = result.value;
    const $ = cheerio.load(html);
    
    const parsedQuestions: any[] = [];
    let currentQuestion: any = null;
    
    $('p').each((_: any, element: any) => {
      const text = $(element).text().trim();
      if (!text) return;

      const questionMatch = text.match(/^(?:Câu\s*hỏi\s*\d+|Question\s*\d+|\d+)\.?\s*(?:\(.*?\))?\s*(.*)/i);
      if (questionMatch) {
        if (currentQuestion) parsedQuestions.push(currentQuestion);
        currentQuestion = {
          _id: new ObjectId(),
          type: 'multiple-choice',
          text: questionMatch[1] || text.replace(/^(?:Câu\s*hỏi\s*\d+|Question\s*\d+|\d+)\.?\s*/i, '').trim(),
          points: 0,
          options: []
        };
        return;
      }

      if (currentQuestion) {
        const optionMatch = text.match(/^([A-E])\.\s*(.*)/i);
        if (optionMatch) {
          const isBold = $(element).find('strong, b').length > 0;
          currentQuestion.options.push({
            _id: new ObjectId(),
            text: optionMatch[2],
            isCorrect: isBold
          });
          return;
        }

        const answerMatch = text.match(/^(?:Đáp\s*án\/?\s*Answer:|Đáp\s*án:)\s*([A-E])/i);
        if (answerMatch && currentQuestion.options.length > 0) {
          const answerLetter = answerMatch[1].toUpperCase();
          const optionIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1...
          if (currentQuestion.options[optionIndex]) {
            currentQuestion.options.forEach((opt: any) => opt.isCorrect = false);
            currentQuestion.options[optionIndex].isCorrect = true;
          }
          return;
        }
        
        if (currentQuestion.options.length === 0 && !text.match(/^([A-E])\./i)) {
          // Multiline question text
          currentQuestion.text += '\n' + text;
        }
      }
    });

    if (currentQuestion) parsedQuestions.push(currentQuestion);

    // Randomize and limit
    let finalQuestions = [...parsedQuestions];
    for (let i = finalQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
    }
    
    if (payload.randomCount && payload.randomCount > 0) {
      if (payload.randomCount > finalQuestions.length) {
        // Resample to fill
        const originalPool = [...finalQuestions];
        while (finalQuestions.length < payload.randomCount) {
          const randomQ = originalPool[Math.floor(Math.random() * originalPool.length)];
          finalQuestions.push({ ...randomQ, _id: new ObjectId() }); // clone with new id
        }
      } else if (!payload.isRandomPerStudent) {
        finalQuestions = finalQuestions.slice(0, payload.randomCount);
      }
    }

    // Distribute points equally
    const activeQuestionCount = (payload.isRandomPerStudent && payload.randomCount > 0) ? payload.randomCount : finalQuestions.length;
    const pointPerQuestion = payload.totalPoints / activeQuestionCount;
    finalQuestions.forEach(q => q.points = pointPerQuestion);

    // Clean up temp file
    if (fs.existsSync(payload.file.filepath)) {
      fs.unlinkSync(payload.file.filepath);
    }

    const testPayload = {
      title: payload.title,
      type: 'test',
      duration: payload.duration,
      totalPoints: payload.totalPoints,
      showResultImmediately: payload.showResultImmediately,
      sessionId: payload.sessionId,
      questions: finalQuestions,
      randomCount: payload.randomCount,
      isRandomPerStudent: payload.isRandomPerStudent,
      status: 'published'
    };

    return this.createGradeItem(classId, testPayload);
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
    const updatePayload: any = { ...payload }
    if (updatePayload.sessionId) {
      updatePayload.sessionId = new ObjectId(updatePayload.sessionId)
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
