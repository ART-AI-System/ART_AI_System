import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Class, { ClassType, StudentSnapshot } from '~/models/schemas/classes.schema'
import usersService from './users.service'
import { UserRoleType } from '~/models/schemas/users.schema'

function normalizeClassPayload(payload: ClassType): ClassType {
  return {
    ...payload,
    semesterId: payload.semesterId instanceof ObjectId ? payload.semesterId : new ObjectId(payload.semesterId),
    subjectId: payload.subjectId instanceof ObjectId ? payload.subjectId : new ObjectId(payload.subjectId),
    subjectSnapshot: {
      ...payload.subjectSnapshot,
      subjectId: payload.subjectSnapshot?.subjectId instanceof ObjectId ? payload.subjectSnapshot.subjectId : new ObjectId(payload.subjectSnapshot?.subjectId)
    },
    lecturer: {
      ...payload.lecturer,
      lecturerId:
        payload.lecturer?.lecturerId instanceof ObjectId
          ? payload.lecturer.lecturerId
          : new ObjectId(payload.lecturer?.lecturerId)
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
    const updateData: any = { ...payload }
    if (payload.semesterId) updateData.semesterId = new ObjectId(payload.semesterId)
    if (payload.subjectId) updateData.subjectId = new ObjectId(payload.subjectId)
    if (payload.subjectSnapshot?.subjectId) {
      updateData.subjectSnapshot.subjectId = new ObjectId(payload.subjectSnapshot.subjectId)
    }
    if (payload.lecturer?.lecturerId) {
      updateData.lecturer.lecturerId = new ObjectId(payload.lecturer.lecturerId)
    }
    if (payload.students) {
      updateData.students = payload.students.map((student) => ({
        ...student,
        studentId: new ObjectId(student.studentId)
      }))
    }

    const result = await databaseService.classes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
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

  async importStudents(classId: string, rows: Record<string, string>[]) {
    const classObjectId = new ObjectId(classId)
    const existingClass = await databaseService.classes.findOne({ _id: classObjectId })
    if (!existingClass) {
      throw new Error('Class not found')
    }

    const currentStudents = existingClass.students || []
    const newStudents: StudentSnapshot[] = []
    const errors: Array<{ row: number; reason: string }> = []
    
    let success = 0
    let failed = 0

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 1
      const row = rows[i]

      const email = (row.email || row['Email'] || '').trim().toLowerCase()
      const studentCode = (row.studentCode || row['Student Code'] || row['student_code'] || '').trim()
      const fullName = (row.fullName || row['Full Name'] || row['full_name'] || '').trim()

      if (!email || !studentCode || !fullName) {
        errors.push({ row: rowNumber, reason: 'Missing required field (email, studentCode, or fullName)' })
        failed++
        continue
      }

      // Check if user exists in db
      let user = await databaseService.users.findOne({ email })
      if (!user) {
        // Check by studentCode just in case
        user = await databaseService.users.findOne({ studentCode })
      }

      if (!user) {
        // Create user
        const password = row.password || Math.random().toString(36).substring(2, 15)
        try {
          user = await usersService.createUser({
            fullName,
            email,
            password,
            role: 'STUDENT',
            studentCode,
            profile: {}
          })
        } catch (error: any) {
          errors.push({ row: rowNumber, reason: `Failed to create user: ${error.message}` })
          failed++
          continue
        }
      } else {
        if (user.role !== 'STUDENT') {
          errors.push({ row: rowNumber, reason: `User ${email} exists but is not a STUDENT` })
          failed++
          continue
        }
      }

      if (user) {
        // Check if already in class
        const isAlreadyInClass = currentStudents.some(s => s.studentId.toString() === user!._id.toString()) || 
                                 newStudents.some(s => s.studentId.toString() === user!._id.toString())
        
        if (isAlreadyInClass) {
          errors.push({ row: rowNumber, reason: `Student ${email} is already in the class` })
          failed++
          continue
        }

        newStudents.push({
          studentId: user._id,
          studentCode: user.studentCode as string,
          fullName: user.fullName,
          email: user.email
        })
        success++
      }
    }

    if (newStudents.length > 0) {
      await databaseService.classes.updateOne(
        { _id: classObjectId },
        { 
          $push: { students: { $each: newStudents } },
          $set: { updatedAt: new Date() }
        }
      )
    }

    return { totalRows: rows.length, success, failed, errors }
  }
}

const classesService = new ClassesService()
export default classesService
