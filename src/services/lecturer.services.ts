import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import GradeReportSubmission from '~/models/schemas/gradeReportSubmissions.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class LecturerService {
  /**
   * Helper to verify if lecturer teaches the class
   */
  private async verifyClassOwnership(lecturerOid: ObjectId, classOid: ObjectId) {
    const cls = await databaseService.classes.findOne({
      _id: classOid,
      $or: [
        { lecturerId: lecturerOid },
        { lecturerId: lecturerOid.toHexString() },
        { 'lecturer.lecturerId': lecturerOid },
        { 'lecturer.lecturerId': lecturerOid.toHexString() }
      ]
    } as any)
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
      .find({
        $and: [
          {
            $or: [
              { lecturerId: lecturerOid },
              { lecturerId: lecturerId },
              { 'lecturer.lecturerId': lecturerOid },
              { 'lecturer.lecturerId': lecturerId }
            ]
          },
          {
            $or: [
              { semesterId: currentSemester._id },
              { semesterId: currentSemester._id.toHexString() }
            ]
          },
          { isActive: true }
        ]
      } as any)
      .toArray()

    const classIds = classes.map((classData: any) => classData._id)
    const memberCounts = classIds.length
      ? await databaseService.classMembers
          .aggregate([
            { $match: { classId: { $in: classIds }, status: { $ne: 'dropped' } } },
            { $group: { _id: '$classId', count: { $sum: 1 } } }
          ])
          .toArray()
      : []
    const memberCountByClass = new Map(memberCounts.map((item: any) => [item._id.toString(), item.count]))

    return {
      currentSemester: {
        id: currentSemester._id,
        name: currentSemester.name
      },
      classes: classes.map((c: any) => ({
        classId: c._id,
        classCode: c.classCode,
        subjectCode: c.subjectSnapshot?.code || c.courseCode,
        subjectName: c.subjectSnapshot?.name || 'Unknown Subject',
        totalStudents:
          memberCountByClass.get(c._id.toString()) ||
          c.students?.length ||
          c.studentIds?.length ||
          0
      }))
    }
  }

  async getClassOverview(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    const cls: any = await this.verifyClassOwnership(lecturerOid, classOid)
    const [memberCount, gradeItems, submissions, grades, evaluations] = await Promise.all([
      databaseService.classMembers.countDocuments({ classId: classOid, status: { $ne: 'dropped' } }),
      databaseService.gradeItems.countDocuments({ classId: classOid, isActive: { $ne: false } }),
      databaseService.submissions
        .find({ classId: classOid, isLatest: true })
        .sort({ submittedAt: -1 })
        .toArray(),
      databaseService.grades.find({ classId: classOid }).toArray(),
      databaseService.aiEvaluations.find({ classId: classOid }).toArray()
    ])

    const totalStudents = memberCount || cls.students?.length || cls.studentIds?.length || 0
    const gradeBySubmission = new Map(grades.map((grade: any) => [grade.submissionId.toString(), grade]))
    const evaluationBySubmission = new Map(
      evaluations.map((evaluation: any) => [evaluation.submissionId.toString(), evaluation])
    )
    const recent = submissions.slice(0, 8)
    const studentIds = recent.map((submission: any) => submission.studentId)
    const gradeItemIds = recent.map((submission: any) => submission.gradeItemId)
    const [students, recentGradeItems] = await Promise.all([
      databaseService.users
        .find({ _id: { $in: studentIds } })
        .project({ fullName: 1, studentCode: 1, username: 1 })
        .toArray(),
      databaseService.gradeItems
        .find({ _id: { $in: gradeItemIds } })
        .project({ title: 1 })
        .toArray()
    ])
    const studentById = new Map(students.map((student: any) => [student._id.toString(), student]))
    const gradeItemById = new Map(recentGradeItems.map((item: any) => [item._id.toString(), item]))

    const submitted = submissions.filter((submission: any) => submission.status === 'submitted').length
    const late = submissions.filter((submission: any) => submission.status === 'late').length
    const draft = submissions.filter((submission: any) => submission.status === 'draft').length
    const graded = submissions.filter((submission: any) => gradeBySubmission.has(submission._id.toString())).length
    const pendingReviews = submissions.filter(
      (submission: any) => submission.status !== 'draft' && !gradeBySubmission.has(submission._id.toString())
    ).length
    const averageScore = grades.length
      ? Number((grades.reduce((sum: number, grade: any) => sum + (grade.score / grade.maxScore) * 10, 0) / grades.length).toFixed(2))
      : 0
    const flaggedSubmissions = evaluations.filter((evaluation: any) => evaluation.riskLevel === 'high').length

    return {
      classId: cls._id,
      classCode: cls.classCode,
      subject: {
        code: cls.subjectSnapshot?.code || cls.courseCode || 'Unknown',
        name: cls.subjectSnapshot?.name || cls.subjectName || 'Unknown Subject'
      },
      totalStudents,
      totalAssignments: gradeItems,
      submissionOverview: {
        totalExpected: gradeItems * totalStudents,
        submitted,
        late,
        draft,
        graded
      },
      pendingReviews,
      averageScore,
      flaggedSubmissions,
      recentSubmissions: recent.map((submission: any) => {
        const student = studentById.get(submission.studentId.toString())
        const grade = gradeBySubmission.get(submission._id.toString())
        const evaluation = evaluationBySubmission.get(submission._id.toString())
        return {
          submissionId: submission._id,
          studentName: student?.fullName || student?.username || 'Unknown student',
          studentCode: student?.studentCode || student?.username || 'N/A',
          assignmentTitle: gradeItemById.get(submission.gradeItemId.toString())?.title || 'Assignment',
          status: submission.status,
          submittedAt: submission.finalizedAt || submission.submittedAt,
          score: grade?.score ?? null,
          maxScore: grade?.maxScore ?? 10,
          riskLevel: evaluation?.riskLevel || 'not_evaluated',
          aiDependencyScore: evaluation?.aiDependencyScore ?? null
        }
      })
    }
  }

  async getSubmissionStatistics(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    await this.verifyClassOwnership(lecturerOid, classOid)

    const [submissions, grades] = await Promise.all([
      databaseService.submissions.find({ classId: classOid, isLatest: true }).toArray(),
      databaseService.grades.find({ classId: classOid }).toArray()
    ])
    const gradeBySubmission = new Set(grades.map((grade: any) => grade.submissionId.toString()))
    const draft = submissions.filter((submission: any) => submission.status === 'draft').length
    const submitted = submissions.filter((submission: any) => submission.status === 'submitted').length
    const late = submissions.filter((submission: any) => submission.status === 'late').length
    const graded = submissions.filter((submission: any) => gradeBySubmission.has(submission._id.toString())).length
    const pendingReviews = submissions.filter(
      (submission: any) => submission.status !== 'draft' && !gradeBySubmission.has(submission._id.toString())
    ).length
    const averageScore = grades.length
      ? Number((grades.reduce((sum: number, grade: any) => sum + (grade.score / grade.maxScore) * 10, 0) / grades.length).toFixed(2))
      : 0

    return {
      draft,
      submitted,
      late,
      graded,
      total: submissions.length,
      pendingReviews,
      averageScore,
      statusDistribution: { draft, submitted, late, graded }
    }
  }

  async getAiStatistics(lecturerId: string, classId: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)

    await this.verifyClassOwnership(lecturerOid, classOid)

    const evaluations = await databaseService.aiEvaluations.find({ classId: classOid }).toArray()
    const countBy = (field: 'pattern' | 'riskLevel') =>
      Array.from(
        evaluations.reduce((counts: Map<string, number>, evaluation: any) => {
          const key = evaluation[field] || 'unknown'
          counts.set(key, (counts.get(key) || 0) + 1)
          return counts
        }, new Map<string, number>())
      ).map(([key, count]) => ({ [field]: key, count }))

    const usageDistribution = evaluations.reduce(
      (distribution, evaluation: any) => {
        const score = Number(evaluation.aiDependencyScore || 0)
        if (score <= 20) distribution.low += 1
        else if (score <= 60) distribution.medium += 1
        else distribution.high += 1
        return distribution
      },
      { low: 0, medium: 0, high: 0 }
    )

    return {
      patternDistribution: countBy('pattern'),
      riskLevelDistribution: countBy('riskLevel'),
      usageDistribution,
      flaggedSubmissions: evaluations.filter((evaluation: any) => evaluation.riskLevel === 'high').length,
      evaluatedSubmissions: evaluations.length,
      averageTransparencyScore: evaluations.length
        ? Number(
            (evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.transparencyScore, 0) /
              evaluations.length).toFixed(2)
          )
        : 0
    }
  }

  async submitGradeReport(lecturerId: string, classId: string, note?: string) {
    const lecturerOid = new ObjectId(lecturerId)
    const classOid = new ObjectId(classId)
    const cls = await this.verifyClassOwnership(lecturerOid, classOid)

    const existingPending = await databaseService.gradeReportSubmissions.findOne({
      classId: classOid,
      status: 'pending'
    })
    if (existingPending) {
      throw new ErrorWithStatus({
        message: 'A pending grade report already exists for this class',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const finalResults = await databaseService.finalResults.find({ classId: classOid }).toArray()
    const avg =
      finalResults.length > 0
        ? finalResults.reduce((sum, r) => sum + r.finalScore, 0) / finalResults.length
        : 0

    const report = new GradeReportSubmission({
      classId: classOid,
      lecturerId: lecturerOid,
      status: 'pending',
      note: note?.trim(),
      averageScore: Number(avg.toFixed(2)),
      totalStudents: cls.students?.length || finalResults.length,
      submittedAt: new Date()
    })

    await databaseService.gradeReportSubmissions.insertOne(report)
    return {
      reportId: report._id,
      classId: classOid,
      status: 'pending',
      averageScore: report.averageScore,
      totalStudents: report.totalStudents,
      submittedAt: report.submittedAt
    }
  }
}

const lecturerService = new LecturerService()
export default lecturerService
