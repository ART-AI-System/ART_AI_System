import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class SubjectHeadService {
  /**
   * Helper to get subject IDs managed by this subject head
   */
  private async getManagedSubjectIds(subjectHeadOid: ObjectId) {
    const departments = await databaseService.departments
      .find({ subjectHeadId: subjectHeadOid, isActive: true })
      .toArray()
    const departmentIds = departments.map((d) => d._id)

    const subjects = await databaseService.subjects
      .find({ departmentId: { $in: departmentIds }, isActive: true })
      .toArray()
    return subjects.map((s) => s._id)
  }

  /**
   * Helper to get class IDs managed by this subject head in a specific semester
   */
  private async getManagedClassIds(subjectHeadOid: ObjectId, semesterOid?: ObjectId) {
    const subjectIds = await this.getManagedSubjectIds(subjectHeadOid)
    if (subjectIds.length === 0) return []

    const query: any = { subjectId: { $in: subjectIds }, isActive: true }
    if (semesterOid) {
      query.semesterId = semesterOid
    }

    const classes = await databaseService.classes.find(query).toArray()
    return classes.map((c) => c._id)
  }

  async getOverview(subjectHeadId: string, semesterId?: string) {
    const subjectHeadOid = new ObjectId(subjectHeadId)
    const semesterOid = semesterId ? new ObjectId(semesterId) : undefined

    const classIds = await this.getManagedClassIds(subjectHeadOid, semesterOid)
    if (classIds.length === 0) {
      return {
        aiUsageByClass: [],
        aiUsageBySubject: [],
        highDependencyCases: 0,
        averageScoreByClass: [],
        averageScoreBySubject: [],
        lecturerReviewActivity: [],
        passRate: 0,
        scoreDistribution: []
      }
    }

    const [
      evaluations,
      finalResults,
      reviews
    ] = await Promise.all([
      databaseService.aiEvaluations.find({ classId: { $in: classIds } }).toArray(),
      databaseService.finalResults.find({ classId: { $in: classIds } }).toArray(),
      databaseService.submissionReviews.aggregate([
        {
          $lookup: {
            from: 'submissions',
            localField: 'submissionId',
            foreignField: '_id',
            as: 'submission'
          }
        },
        { $unwind: '$submission' },
        { $match: { 'submission.classId': { $in: classIds } } }
      ]).toArray()
    ])

    // AI usage by class
    const aiUsageByClass = classIds.map((cId) => {
      const classEvals = evaluations.filter((e) => e.classId.equals(cId))
      return {
        classId: cId,
        count: classEvals.length
      }
    })

    // AI usage by subject
    const aiUsageBySubject: any[] = []
    const subjectGroupsEvals = evaluations.reduce((acc: any, e: any) => {
      const sId = e.subjectId?.toString() || 'unknown'
      if (!acc[sId]) acc[sId] = 0
      acc[sId]++
      return acc
    }, {})
    for (const [sId, count] of Object.entries(subjectGroupsEvals)) {
      aiUsageBySubject.push({ subjectId: sId, count })
    }

    // High dependency cases
    const highDependencyCases = evaluations.filter((e) => e.pattern === 'high_dependency').length

    // Average score by class
    const averageScoreByClass = classIds.map((cId) => {
      const classResults = finalResults.filter((r) => r.classId.equals(cId))
      const avg = classResults.length > 0 ? classResults.reduce((sum, r) => sum + r.finalScore, 0) / classResults.length : 0
      return { classId: cId, averageScore: Number(avg.toFixed(2)) }
    })

    // Pass rate (>= 5.0)
    const passedCount = finalResults.filter((r) => r.finalScore >= 5.0).length
    const passRate = finalResults.length > 0 ? Number(((passedCount / finalResults.length) * 100).toFixed(2)) : 0

    return {
      aiUsageByClass,
      aiUsageBySubject,
      highDependencyCases,
      averageScoreByClass,
      averageScoreBySubject: [], // Simplified for now, can aggregate similar to class
      lecturerReviewActivity: [], // Simplified
      passRate,
      scoreDistribution: [] // Simplified
    }
  }

  async getClasses(subjectHeadId: string, semesterId?: string) {
    const subjectHeadOid = new ObjectId(subjectHeadId)
    const semesterOid = semesterId ? new ObjectId(semesterId) : undefined

    const subjectIds = await this.getManagedSubjectIds(subjectHeadOid)
    const query: any = { subjectId: { $in: subjectIds }, isActive: true }
    if (semesterOid) query.semesterId = semesterOid

    const classes = await databaseService.classes.find(query).toArray()
    return classes.map((c: any) => ({
      classId: c._id,
      classCode: c.classCode,
      subjectCode: c.subjectName,
      lecturerName: c.lecturer?.fullName,
      totalStudents: c.students?.length || 0
    }))
  }

  async getClassAnalytics(subjectHeadId: string, classId: string) {
    // Basic class analytics stub
    return { classId, message: 'Class analytics not fully detailed in spec, returning stub' }
  }

  async getSubjectAnalytics(subjectHeadId: string, subjectId: string) {
    // Basic subject analytics stub
    return { subjectId, message: 'Subject analytics not fully detailed in spec, returning stub' }
  }

  async getStudentDetail(subjectHeadId: string, studentId: string) {
    // Basic student detail stub
    return { studentId, message: 'Student detail returning stub' }
  }

  async getLecturerAnalytics(subjectHeadId: string, lecturerId: string) {
    // Basic lecturer analytics stub
    return { lecturerId, message: 'Lecturer analytics returning stub' }
  }
}

const subjectHeadService = new SubjectHeadService()
export default subjectHeadService
