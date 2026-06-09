import { Router } from 'express'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import {
  getStudentDashboardController,
  getLecturerDashboardController,
  getSubjectHeadDashboardController,
  getAdminDashboardController
} from '~/controllers/dashboard.controllers'

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Router — Phase 2
//
// Security chain for every route:
//   requireAuth  → Validates JWT, looks up user in DB, verifies isActive === true,
//                  and attaches req.user (the full user document).
//   requireRole  → Reads req.user.role (from DB, not JWT) and enforces RBAC.
//
// Student route has NO role guard beyond requireAuth:
//   Any authenticated, active user calling GET /student receives their OWN data
//   because the controller reads identity from req.user._id (self-scoping),
//   preventing horizontal privilege escalation.
// ─────────────────────────────────────────────────────────────────────────────

const dashboardRouter = Router()

/**
 * GET /api/dashboard/student
 *
 * Access: Any authenticated active user (self-scoped to own data).
 * No requireRole guard — identity scoping happens in the controller/service.
 */
dashboardRouter.get('/student', requireAuth, getStudentDashboardController)

/**
 * GET /api/dashboard/lecturer
 *
 * Access: LECTURER role only.
 * Data scoped to classes taught by the authenticated lecturer.
 */
dashboardRouter.get('/lecturer', requireAuth, requireRole('LECTURER'), getLecturerDashboardController)

/**
 * GET /api/dashboard/subject-head
 *
 * Access: SUBJECT_HEAD role only.
 * Data is system-wide or filtered by ?semester= query parameter.
 */
dashboardRouter.get(
  '/subject-head',
  requireAuth,
  requireRole('SUBJECT_HEAD'),
  getSubjectHeadDashboardController
)

/**
 * GET /api/dashboard/admin
 *
 * Access: ADMIN role only.
 * Global system counts and user role breakdown.
 */
dashboardRouter.get('/admin', requireAuth, requireRole('ADMIN'), getAdminDashboardController)

export default dashboardRouter
