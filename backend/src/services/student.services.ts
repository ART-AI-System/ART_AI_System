import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { ErrorWithStatus } from '../models/Errors'
import HTTP_STATUS from '../constants/httpStatus'

class StudentService {
  /**
   * Helper to format enrolled subjects from Class/ClassMember records
   */
  private async getEnrolledSubjects(studentOid: ObjectId, semesterOid: ObjectId) {
    const classMembers = await databaseService.classMembers
      .find({ studentId: studentOid, semesterId: semesterOid, status: 'active' })
      .toArray()

    const classIds = classMembers.map((cm) => cm.classId)

    if (classIds.length === 0) return []

    const classes = await databaseService.classes
      .find({ _id: { $in: classIds }, isActive: true })
      .toArray()

    return classes.map((c: any) => ({
      subjectId: c._id, // Using class ID as fallback if subjectId is missing
      subjectCode: c.subjectName, // fallback
      subjectName: c.subjectName,
      classId: c._id,
      classCode: c.classCode,
      lecturerName: c.lecturer?.fullName
    }))
  }

  async getHome(studentId: string) {
    const studentOid = new ObjectId(studentId)

    // Find current semester
    const currentSemester = await databaseService.semesters.findOne({ isCurrent: true, isActive: true })
    if (!currentSemester) {
      return {
        currentSemester: null,
        subjects: []
      }
    }

    const subjects = await this.getEnrolledSubjects(studentOid, currentSemester._id)

    return {
      currentSemester: {
        id: currentSemester._id,
        name: currentSemester.name
      },
      subjects
    }
  }

  async getSubjectsBySemester(studentId: string, semesterId: string) {
    const studentOid = new ObjectId(studentId)
    const semesterOid = new ObjectId(semesterId)

    const subjects = await this.getEnrolledSubjects(studentOid, semesterOid)
    return { subjects }
  }

  async getClassSessions(studentId: string, classId: string, page: number, limit: number) {
    const studentOid = new ObjectId(studentId)
    const classOid = new ObjectId(classId)

    // Verify student is enrolled in this class
    const enrollment = await databaseService.classMembers.findOne({
      studentId: studentOid,
      classId: classOid,
      status: 'active'
    })

    if (!enrollment) {
      throw new ErrorWithStatus({
        message: 'Student is not enrolled in this class',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const skip = (page - 1) * limit
    const take = limit

    const [sessions, total] = await Promise.all([
      databaseService.sessions
        .find({ classId: classOid, isPublished: true })
        .sort({ sessionNo: 1 })
        .skip(skip)
        .limit(take)
        .toArray(),
      databaseService.sessions.countDocuments({ classId: classOid, isPublished: true })
    ])

    return {
      sessions,
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    }
  }
}

const studentService = new StudentService()
export default studentService
