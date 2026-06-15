import databaseService from './database.service'

type RoleKey = 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN'
type RoleCountMap = Partial<Record<RoleKey, number>>

class AdminService {
  async getDashboard() {
    const [totalUsers, totalClasses, totalSubjects, totalSubmissions, totalAiInteractions, roleBreakdownArr] =
      await Promise.all([
        databaseService.users.estimatedDocumentCount(),
        databaseService.classes.estimatedDocumentCount(),
        databaseService.subjects.estimatedDocumentCount(),
        databaseService.submissions.estimatedDocumentCount(),
        databaseService.aiInteractions.estimatedDocumentCount(),

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

    const usersByRole: RoleCountMap = {}
    for (const item of roleBreakdownArr as Array<{ role: string; count: number }>) {
      const key = (item.role ?? '').toUpperCase() as RoleKey
      usersByRole[key] = (usersByRole[key] ?? 0) + item.count
    }

    // Assume all non-inactive users are active
    const activeUsers = await databaseService.users.countDocuments({ status: { $ne: 'inactive' } })

    return {
      systemCounts: {
        totalUsers,
        totalClasses,
        totalSubjects,
        totalSubmissions,
        totalAiInteractions
      },
      usersByRole,
      activeUsers
    }
  }

  async getSystemActivity() {
    // Email success/failure metrics from EmailLog
    const emailStats = await databaseService.emailLogs
      .aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      .toArray()

    const emailSuccess = emailStats.find((s) => s._id === 'success')?.count || 0
    const emailFailure = emailStats.find((s) => s._id === 'failed')?.count || 0

    // Stubbing other system activity as per instruction (since there's no ActivityLog collection specified)
    return {
      emailMetrics: {
        success: emailSuccess,
        failure: emailFailure,
        total: emailSuccess + emailFailure
      },
      recentActivity: [
        {
          type: 'system_announcement',
          message: 'Stub: System maintenance scheduled for weekend',
          createdAt: new Date().toISOString()
        },
        {
          type: 'user_login',
          message: 'Stub: High login volume detected',
          createdAt: new Date().toISOString()
        }
      ]
    }
  }
}

const adminService = new AdminService()
export default adminService
