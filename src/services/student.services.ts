import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { ErrorWithStatus } from '../models/Errors'
import HTTP_STATUS from '../constants/httpStatus'

class StudentService {
  /**
   * Helper to format enrolled subjects from Class/ClassMember records
   */
  private async getEnrolledSubjects(studentOid: ObjectId, semesterOid: ObjectId) {
    const classes = await databaseService.classes
      .find({ 
        'students.studentId': studentOid, 
        semesterId: semesterOid,
        isActive: { $ne: false } // Include classes without isActive or where it is true
      })
      .toArray()

    if (classes.length === 0) return []

    const rawSubjectIds = classes.map((c: any) => c.subjectId).filter(Boolean)
    const subjectIds = rawSubjectIds.map((id: any) => new ObjectId(id))
    const rawLecturerIds = classes.map((c: any) => c.lecturer?.lecturerId || c.lecturerId).filter(Boolean)
    const lecturerIds = rawLecturerIds.map((id: any) => new ObjectId(id))

    const [subjects, lecturers] = await Promise.all([
      databaseService.subjects.find({ _id: { $in: subjectIds } }).toArray(),
      databaseService.users.find({ _id: { $in: lecturerIds } }).toArray()
    ])

    return classes.map((c: any) => {
      const subject = subjects.find((s) => s._id.toString() === (c.subjectId || c.subjectSnapshot?.subjectId)?.toString())
      const lecturer = lecturers.find((l) => l._id.toString() === (c.lecturerId || c.lecturer?.lecturerId)?.toString())
      
      return {
        subjectId: c.subjectId || c.subjectSnapshot?.subjectId,
        subjectCode: subject?.code || c.subjectSnapshot?.code || 'UNK',
        subjectName: subject?.name || c.subjectSnapshot?.name || 'Unknown Subject',
        classId: c._id,
        classCode: c.classCode,
        lecturerName: lecturer?.fullName || c.lecturer?.fullName || 'Unknown Lecturer'
      }
    })
  }

  async getHome(studentId: string, semesterId?: string) {
    const studentOid = new ObjectId(studentId)

    let targetSemester;
    if (semesterId) {
      targetSemester = await databaseService.semesters.findOne({ _id: new ObjectId(semesterId) })
    } else {
      // Find current semester
      targetSemester = await databaseService.semesters.findOne({ isCurrent: true, isActive: { $ne: false } })
    }

    if (!targetSemester) {
      return {
        currentSemester: null,
        subjects: []
      }
    }

    const subjects = await this.getEnrolledSubjects(studentOid, targetSemester._id)

    return {
      currentSemester: targetSemester,
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
