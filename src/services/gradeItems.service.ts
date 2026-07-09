import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import GradeItem, { GradeItemType } from '~/models/schemas/gradeItems.schema'

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
}

const gradeItemsService = new GradeItemsService()
export default gradeItemsService
