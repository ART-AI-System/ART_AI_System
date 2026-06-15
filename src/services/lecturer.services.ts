import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class LecturerService {
  /**
   * Helper to verify if lecturer teaches the class
   */
  private async verifyClassOwnership(lecturerOid: ObjectId, classOid: ObjectId) {
    const cls = await databaseService.classes.findOne({ _id: classOid, lecturerId: lecturerOid })
    if (!cls) {
      throw new ErrorWithStatus({
        message: 'Lecturer is not assigned to this class or class does not exist',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    return cls
  }

  async getHome(lecturerId: string) {
    const lecturerOid = new ObjectId(lecturerId)

    // Find current semester
    const currentSemester = await databaseService.semesters.findOne({ isCurrent: true, isActive: true })
    if (!currentSemester) {
      return {
        currentSemester: null,
        classes: []
      }
    }

    const classes = await databaseService.classes
      .find({ lecturerId: lecturerOid, semesterId: currentSemester._id, isActive: true })
      .toArray()

    return {
      currentSemester: {
        id: currentSemester._id,
        name: currentSemester.name
      },
      classes: classes.map((c: any) => ({
        classId: c._id,
        classCode: c.classCode,
        subjectCode: c.subjectName, // fallback
        subjectName: c.subjectName,
        totalStudents: c.students?.length || 0
      }))
    }
  }

  async getClassOverview(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    const cls: any = await this.verifyClassOwnership(lecturerOid, classOid)
    const totalStudents = cls.students?.length || 0

    const [assignments, submissionStats, pendingReviews, finalResults, flaggedSubmissions] = await Promise.all([
      databaseService.assignments.countDocuments({ classId: classOid }),
      databaseService.submissions
        .aggregate([
          { $match: { classId: classOid, isLatest: true } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
        .toArray(),
      databaseService.submissions.aggregate([
        { $match: { classId: classOid } },
        {
          $lookup: {
            from: 'submissionreviews',
            localField: '_id',
            foreignField: 'submissionId',
            as: 'reviews'
          }
        },
        { $unwind: '$reviews' },
        { $match: { 'reviews.reviewStatus': 'pending', 'reviews.lecturerId': lecturerOid } },
        { $count: 'pendingReviewsCount' }
      ]).toArray(),
      databaseService.finalResults
        .aggregate([
          { $match: { classId: classOid } },
          { $group: { _id: null, avg: { $avg: '$finalScore' } } }
        ])
        .toArray(),
      databaseService.submissionFlags.countDocuments({ classId: classOid, isResolved: false })
    ])

    // Notice that submissionReviews does not have classId in schema directly, it has submissionId.
    // Wait, let's fix pendingReviews:
    const pendingReviewsCount = pendingReviews[0]?.pendingReviewsCount || 0
    // Actually, to get pending reviews for THIS class, we might need a lookup or we can just query submissions in this class and check pending reviews.
    // A simpler way: we'll use a lookup or aggregate if needed. Since it's an overview, let's do a correct count.
    
    // Total expected submissions = assignments * totalStudents
    const totalExpected = assignments * totalStudents
    const draft = submissionStats.find((s) => s._id === 'draft')?.count || 0
    const submitted = submissionStats.find((s) => s._id === 'submitted')?.count || 0
    const late = submissionStats.find((s) => s._id === 'late')?.count || 0

    return {
      classId: cls._id,
      classCode: cls.classCode,
      subject: {
        code: cls.subjectName,
        name: cls.subjectName
      },
      totalStudents,
      totalAssignments: assignments,
      submissionOverview: {
        totalExpected,
        submitted,
        late,
        draft
      },
      pendingReviews: pendingReviewsCount, // Will refine pendingReviews query logic below
      averageScore: finalResults[0]?.avg ? Number(finalResults[0].avg.toFixed(2)) : 0,
      flaggedSubmissions
    }
  }

  async getSubmissionStatistics(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    await this.verifyClassOwnership(lecturerOid, classOid)

    const stats = await databaseService.submissions
      .aggregate([
        { $match: { classId: classOid, isLatest: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      .toArray()

    const draft = stats.find((s) => s._id === 'draft')?.count || 0
    const submitted = stats.find((s) => s._id === 'submitted')?.count || 0
    const late = stats.find((s) => s._id === 'late')?.count || 0

    return {
      draft,
      submitted,
      late,
      total: draft + submitted + late
    }
  }

  async getAiStatistics(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    await this.verifyClassOwnership(lecturerOid, classOid)

    const [patternDistribution, riskLevelDistribution] = await Promise.all([
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: classOid } },
          { $group: { _id: '$pattern', count: { $sum: 1 } } },
          { $project: { _id: 0, pattern: '$_id', count: 1 } }
        ])
        .toArray(),
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: classOid } },
          { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
          { $project: { _id: 0, riskLevel: '$_id', count: 1 } }
        ])
        .toArray()
    ])

    return {
      patternDistribution,
      riskLevelDistribution
    }
  }
}

const lecturerService = new LecturerService()
export default lecturerService
