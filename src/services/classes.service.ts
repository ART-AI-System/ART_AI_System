import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Class, { ClassType } from '~/models/schemas/classes.schema'

function normalizeClassPayload(payload: ClassType): ClassType {
  return {
    ...payload,
    lecturer: {
      ...payload.lecturer,
      lecturerId:
        payload.lecturer.lecturerId instanceof ObjectId
          ? payload.lecturer.lecturerId
          : new ObjectId(payload.lecturer.lecturerId)
    },
    students: (payload.students || []).map((student) => ({
      ...student,
      studentId: student.studentId instanceof ObjectId ? student.studentId : new ObjectId(student.studentId)
    }))
  }
}

class ClassesService {
  async createClass(payload: ClassType) {
    const newClass = new Class(normalizeClassPayload(payload))
    const result = await databaseService.classes.insertOne(newClass)
    return { ...newClass, _id: result.insertedId }
  }

  async getClasses() {
    const classes = await databaseService.classes.find({}).toArray()
    return classes
  }

  async getClassById(id: string) {
    const classData = await databaseService.classes.findOne({ _id: new ObjectId(id) })
    return classData
  }

  async updateClass(id: string, payload: Partial<ClassType>) {
    const normalizedPayload = payload.lecturer
      ? normalizeClassPayload(payload as ClassType)
      : {
          ...payload,
          students: payload.students?.map((student) => ({
            ...student,
            studentId: student.studentId instanceof ObjectId ? student.studentId : new ObjectId(student.studentId)
          }))
        }

    const result = await databaseService.classes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...normalizedPayload,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteClass(id: string) {
    const result = await databaseService.classes.findOneAndDelete({ _id: new ObjectId(id) })
    return result
  }
}

const classesService = new ClassesService()
export default classesService
