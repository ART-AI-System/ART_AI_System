import { ObjectId } from 'mongodb'
import databaseService from './database.service'

type RoleKey = 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN'
type RoleCountMap = Partial<Record<RoleKey, number>>

class DashboardService {
  // ───────────────────────────────────────────────────────────────────────────
  // A. GET /api/dashboard/student
  //
  // Runs 5 parallel MongoDB queries:
  //   1. Submitted assignments count
  //   2. Pending assignments count (grade items with no matching submission)
  //   3. Average score across all graded items (normalised /10)
  //   4. Dominant AI usage pattern
  //   5. Unresolved flag count received by this student
  // ───────────────────────────────────────────────────────────────────────────
  async getStudentDashboard(studentId: string) {
    const studentOid = new ObjectId(studentId)

    // ── Step 1: Resolve active class IDs for this student ───────────────────
    // The class document embeds a students[] snapshot array with { studentId }
    const classDocs = await databaseService.classes
      .find(
        { 'students.studentId': studentOid, isActive: true },
        { projection: { _id: 1 } }
      )
      .toArray()
    const classIds = classDocs.map((c: any) => c._id)

    // ── Step 2: Resolve all gradeItemIds for those classes ──────────────────
    const gradeItemDocs =
      classIds.length > 0
        ? await databaseService.gradeItems
            .find({ classId: { $in: classIds }, isActive: true }, { projection: { _id: 1 } })
            .toArray()
        : []
    const allGradeItemIds = gradeItemDocs.map((g: any) => g._id)

    // ── Step 3: Find gradeItemIds that already have a submission ────────────
    const submittedGradeItemIds =
      allGradeItemIds.length > 0
        ? (
            await databaseService.submissions
              .find(
                { studentId: studentOid, gradeItemId: { $in: allGradeItemIds }, isLatest: true },
                { projection: { gradeItemId: 1, _id: 0 } }
              )
              .toArray()
          ).map((s: any) => s.gradeItemId.toString())
        : []

    const pendingCount =
      allGradeItemIds.length > 0
        ? allGradeItemIds.filter((id: ObjectId) => !submittedGradeItemIds.includes(id.toString())).length
        : 0

    // ── Parallel fetches ─────────────────────────────────────────────────────
    const [submittedCount, avgScoreAgg, dominantPatternAgg, flagCount] = await Promise.all([
      // 1. Submitted assignments (non-draft, latest version)
      databaseService.submissions.countDocuments({
        studentId: studentOid,
        status: { $ne: 'draft' },
        isLatest: true
      }),

      // 3. Average normalised score
      databaseService.grades
        .aggregate([
          { $match: { studentId: studentOid } },
          {
            $addFields: {
              normalisedScore: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 10] }
            }
          },
          {
            $group: {
              _id: null,
              avgScore: { $avg: '$normalisedScore' }
            }
          },
          {
            $project: {
              _id: 0,
              avgScore: { $round: ['$avgScore', 2] }
            }
          }
        ])
        .toArray(),

      // 4. Dominant AI usage pattern
      databaseService.aiEvaluations
        .aggregate([
          { $match: { studentId: studentOid } },
          { $group: { _id: '$pattern', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, pattern: '$_id' } }
        ])
        .toArray(),

      // 5. Unresolved flags received by this student
      databaseService.submissionFlags.countDocuments({
        studentId: studentOid,
        isResolved: false
      })
    ])

    return {
      submittedAssignments: submittedCount,
      pendingAssignments: pendingCount,
      averageScore: avgScoreAgg[0]?.avgScore ?? null,
      dominantAiPattern: dominantPatternAgg[0]?.pattern ?? null,
      flagsReceived: flagCount
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // B. GET /api/dashboard/lecturer
  //
  // Runs 4 parallel metrics:
  //   1. Total active classes taught
  //   2. Total distinct students enrolled (deduped across classes)
  //   3. Pending submission reviews assigned to this lecturer
  //   4. Unresolved flagged submissions across all lecturer classes
  //   5. AI usage pattern distribution across those classes
  // ───────────────────────────────────────────────────────────────────────────
  async getLecturerDashboard(lecturerId: string) {
    const lecturerOid = new ObjectId(lecturerId)

    // Resolve all active classes where this lecturer is assigned
    const classDocs = await databaseService.classes
      .find(
        { 'lecturer.lecturerId': lecturerOid, isActive: true },
        { projection: { _id: 1 } }
      )
      .toArray()
    const classIds = classDocs.map((c: any) => c._id)
    const totalClasses = classDocs.length

    if (classIds.length === 0) {
      return {
        totalClasses: 0,
        totalStudents: 0,
        pendingReviews: 0,
        flaggedSubmissions: 0,
        aiUsageDistribution: []
      }
    }

    const [distinctStudentAgg, pendingReviews, flaggedCount, aiDistribution] = await Promise.all([
      // 2. Distinct student count (deduplicated across multiple classes)
      //    $unwind the embedded snapshot, then $group by studentId to count unique IDs.
      databaseService.classes
        .aggregate([
          { $match: { _id: { $in: classIds } } },
          { $unwind: '$students' },
          {
            $group: {
              _id: '$students.studentId'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ])
        .toArray(),

      // 3. Pending reviews for this lecturer
      databaseService.submissionReviews.countDocuments({
        lecturerId: lecturerOid,
        reviewStatus: 'pending'
      }),

      // 4. Unresolved flagged submissions in lecturer's classes
      databaseService.submissionFlags.countDocuments({
        classId: { $in: classIds },
        isResolved: false
      }),

      // 5. AI usage pattern distribution for this lecturer's classes
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: { $in: classIds } } },
          { $group: { _id: '$pattern', count: { $sum: 1 } } },
          { $project: { _id: 0, pattern: '$_id', count: 1 } },
          { $sort: { count: -1 } }
        ])
        .toArray()
    ])

    return {
      totalClasses,
      totalStudents: distinctStudentAgg[0]?.total ?? 0,
      pendingReviews,
      flaggedSubmissions: flaggedCount,
      aiUsageDistribution: aiDistribution
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // C. GET /api/dashboard/subject-head
  //
  // Metrics:
  //   1. Academic performance summary (classification counts from final_results)
  //   2. AI usage trends by pattern + week (via $dateTrunc)
  //   3. Total unresolved suspicious flags
  //   4. High-dependency case count
  // ───────────────────────────────────────────────────────────────────────────
  async getSubjectHeadDashboard(semesterFilter?: string) {
    // Build base class match filter
    const classMatch: Record<string, any> = {}
    if (semesterFilter) {
      classMatch.semester = semesterFilter
    }

    // Resolve classIds for the scope (all or semester-filtered)
    const classDocs = await databaseService.classes
      .find(classMatch, { projection: { _id: 1, semester: 1 } })
      .toArray()
    const classIds = classDocs.map((c: any) => c._id)

    const finalResultsMatch: Record<string, any> = {}
    const evaluationsMatch: Record<string, any> = {}
    const flagsMatch: Record<string, any> = { isResolved: false }

    if (classIds.length > 0 && semesterFilter) {
      finalResultsMatch.classId = { $in: classIds }
      evaluationsMatch.classId = { $in: classIds }
      flagsMatch.classId = { $in: classIds }
    }

    const [performanceSummary, aiUsageTrends, totalUnresolvedFlags, highDependencyCount] = await Promise.all([
      // 1. Academic performance: count by classification bucket
      databaseService.finalResults
        .aggregate([
          ...(Object.keys(finalResultsMatch).length > 0 ? [{ $match: finalResultsMatch }] : []),
          {
            $group: {
              _id: '$classification',
              count: { $sum: 1 }
            }
          },
          {
            $project: { _id: 0, classification: '$_id', count: 1 }
          },
          { $sort: { classification: 1 } }
        ])
        .toArray(),

      // 2. AI usage trends: group by pattern + truncated week
      databaseService.aiEvaluations
        .aggregate([
          ...(Object.keys(evaluationsMatch).length > 0 ? [{ $match: evaluationsMatch }] : []),
          {
            $addFields: {
              weekStart: {
                $dateTrunc: { date: '$createdAt', unit: 'week' }
              }
            }
          },
          {
            $group: {
              _id: { pattern: '$pattern', week: '$weekStart' },
              count: { $sum: 1 },
              avgDependencyScore: { $avg: '$aiDependencyScore' }
            }
          },
          {
            $project: {
              _id: 0,
              pattern: '$_id.pattern',
              week: '$_id.week',
              count: 1,
              avgDependencyScore: { $round: ['$avgDependencyScore', 2] }
            }
          },
          { $sort: { week: -1, count: -1 } }
        ])
        .toArray(),

      // 3. Total unresolved suspicious flags
      databaseService.submissionFlags.countDocuments({
        ...flagsMatch,
        suspectLevel: 'high'
      }),

      // 4. High dependency evaluations count
      databaseService.aiEvaluations.countDocuments({
        ...(Object.keys(evaluationsMatch).length > 0 ? evaluationsMatch : {}),
        pattern: 'high_dependency'
      })
    ])

    return {
      semester: semesterFilter ?? 'all',
      performanceSummary,
      aiUsageTrends,
      totalUnresolvedFlags,
      highDependencyCount
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // D. GET /api/dashboard/admin
  //
  // Metrics:
  //   1. System counts: users, classes, submissions, ai_interactions
  //   2. Role breakdown: group users by role → uppercase key mapping
  // ───────────────────────────────────────────────────────────────────────────
  async getAdminDashboard() {
    const [totalUsers, totalClasses, totalSubmissions, totalAiInteractions, roleBreakdownArr] =
      await Promise.all([
        // Fast estimated counts — O(1) for large collections
        databaseService.users.estimatedDocumentCount(),
        databaseService.classes.estimatedDocumentCount(),
        databaseService.submissions.estimatedDocumentCount(),
        databaseService.aiInteractions.estimatedDocumentCount(),

        // Role breakdown aggregation
        databaseService.users
          .aggregate([
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 }
              }
            },
            {
              $project: { _id: 0, role: '$_id', count: 1 }
            }
          ])
          .toArray()
      ])

    // Map aggregation array to uppercase-keyed object.
    // Database stores roles in uppercase ('STUDENT', 'LECTURER', 'SUBJECT_HEAD', 'ADMIN').
    const usersByRole: RoleCountMap = {}
    for (const item of roleBreakdownArr as Array<{ role: string; count: number }>) {
      const key = (item.role ?? '').toUpperCase() as RoleKey
      usersByRole[key] = (usersByRole[key] ?? 0) + item.count
    }

    return {
      systemCounts: {
        users: totalUsers,
        classes: totalClasses,
        submissions: totalSubmissions,
        aiInteractions: totalAiInteractions
      },
      usersByRole
    }
  }
}

const dashboardService = new DashboardService()
export default dashboardService
