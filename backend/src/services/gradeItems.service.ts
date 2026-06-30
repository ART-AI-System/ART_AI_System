import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import GradeItem, { GradeItemType } from '~/models/schemas/gradeItems.schema'

class GradeItemsService {
  async createGradeItem(classId: string, payload: Omit<GradeItemType, 'classId'>) {
    const newGradeItem = new GradeItem({
      ...payload,
      classId: new ObjectId(classId)
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
    const result = await databaseService.gradeItems.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
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
