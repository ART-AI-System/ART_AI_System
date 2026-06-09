import { Router } from 'express'
import { param, query } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  getGradeSummaryController,
  getFinalResultsReportController,
  getRankingsController,
  getClassificationsController,
  getClassAiUsageController,
  getSemesterAiUsageController,
  getSuspiciousCasesController,
  exportExcelController,
  exportPdfController,
  exportCsvController
} from '~/controllers/report.controllers'

/**
 * Validates that a named route parameter is a valid MongoDB ObjectId string.
 * Prevents runtime crashes from invalid ObjectId construction in service layer.
 *
 * @param paramName - The Express route parameter name (e.g. 'classId')
 */
const validateObjectIdParam = (paramName: string) =>
  validate(
    // checkSchema expects RunnableValidationChains, but param() returns a
    // standalone chain we wrap with { run, ... } shimming via validate()
    // directly from express-validator's param() helper:
    {
      run: async (req: any) => {
        await param(paramName)
          .isMongoId()
          .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
          .run(req)
      }
    } as any
  )

/**
 * Validates the :semester route parameter.
 * Accepts alphanumeric strings with hyphens/underscores (e.g. HK1-2024).
 */
const validateSemesterParam = validate(
  {
    run: async (req: any) => {
      await param('semester')
        .notEmpty()
        .withMessage('semester is required')
        .isString()
        .trim()
        .matches(/^[A-Za-z0-9\-_]+$/)
        .withMessage('semester contains invalid characters — use letters, numbers, hyphens, or underscores only')
        .run(req)
    }
  } as any
)

/**
 * Optional query param validators for GET /suspicious-cases
 */
const validateSuspiciousQueryParams = validate(
  {
    run: async (req: any) => {
      await Promise.all([
        query('classId')
          .optional()
          .isMongoId()
          .withMessage('classId query param must be a valid MongoDB ObjectId')
          .run(req),
        query('semester')
          .optional()
          .isString()
          .trim()
          .matches(/^[A-Za-z0-9\-_]+$/)
          .withMessage('semester query param contains invalid characters')
          .run(req)
      ])
    }
  } as any
)

const reportRouter = Router()

// ── Section 9.1 — Academic Reports ───────────────────────────────────────────
// Role: LECTURER or SUBJECT_HEAD

reportRouter.get(
  '/classes/:classId/grade-summary',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getGradeSummaryController
)

reportRouter.get(
  '/classes/:classId/final-results',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getFinalResultsReportController
)

reportRouter.get(
  '/classes/:classId/rankings',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getRankingsController
)

reportRouter.get(
  '/classes/:classId/classifications',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getClassificationsController
)

// ── Section 9.2 — AI Usage Reports ───────────────────────────────────────────

reportRouter.get(
  '/classes/:classId/ai-usage',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getClassAiUsageController
)

reportRouter.get(
  '/semesters/:semester/ai-usage',
  requireAuth,
  requireRole('SUBJECT_HEAD'),
  validateSemesterParam,
  getSemesterAiUsageController
)

reportRouter.get(
  '/suspicious-cases',
  requireAuth,
  requireRole('SUBJECT_HEAD'),
  validateSuspiciousQueryParams,
  getSuspiciousCasesController
)

// ── Section 9.3 — Export Reports ─────────────────────────────────────────────
// Role: LECTURER or SUBJECT_HEAD

reportRouter.get(
  '/classes/:classId/export-excel',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  exportExcelController
)

reportRouter.get(
  '/classes/:classId/export-pdf',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  exportPdfController
)

reportRouter.get(
  '/classes/:classId/export-csv',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  exportCsvController
)

export default reportRouter
