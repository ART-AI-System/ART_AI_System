import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import dashboardService from '~/services/dashboard.services'

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Controllers — Phase 2
//
// All controllers are thin wrappers that:
//  1. Extract the security identity from req.user (populated by requireAuth)
//  2. Delegate to dashboardService for all business logic
//  3. Return a standard JSON envelope: { message, result }
//
// Security note:
//   For the student dashboard, studentId is taken from req.user._id (the
//   authenticated user's own identity), NOT from any request parameter.
//   This prevents horizontal privilege escalation (student A accessing student B's data).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/student
 *
 * Self-scoped analytics for the authenticated student.
 * Identity enforced from JWT/DB: req.user._id — no query param injection possible.
 */
export const getStudentDashboardController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // req.user is guaranteed to be populated by requireAuth middleware
    const studentId = (req.user!._id as any).toHexString()
    const result = await dashboardService.getStudentDashboard(studentId)
    res.json({
      message: 'Get student dashboard successfully',
      result
    })
  }
)

/**
 * GET /api/dashboard/lecturer
 *
 * Dashboard metrics for the authenticated lecturer.
 * Scoped to classes where lecturer.lecturerId === req.user._id.
 */
export const getLecturerDashboardController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const result = await dashboardService.getLecturerDashboard(lecturerId)
    res.json({
      message: 'Get lecturer dashboard successfully',
      result
    })
  }
)

/**
 * GET /api/dashboard/subject-head
 *
 * System-wide or semester-filtered dashboard analytics.
 * Supports optional query parameter: ?semester=HK1-2026
 */
export const getSubjectHeadDashboardController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Optional semester filter from query string — no validation required;
    // undefined means system-wide scope.
    const semester = req.query['semester'] as string | undefined
    const result = await dashboardService.getSubjectHeadDashboard(semester)
    res.json({
      message: 'Get subject head dashboard successfully',
      result
    })
  }
)

/**
 * GET /api/dashboard/admin
 *
 * Admin system-wide overview: document counts + user role breakdown.
 * No scoping required — admin has global visibility.
 */
export const getAdminDashboardController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await dashboardService.getAdminDashboard()
    res.json({
      message: 'Get admin dashboard successfully',
      result
    })
  }
)
