import { Router } from 'express'
import { param, query } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import {
  calculateClassFinalResultsController,
  getFinalResultsByClassController,
  getStudentFinalResultInClassController,
  exportFinalResultsController,
  getMyFinalResultsController,
  getClassClassificationsController,
  getClassRankingsController,
  getStudentClassificationController
} from '~/controllers/finalResult.controllers'

const validateObjectIdParam = (paramName: string) =>
  validate({
    run: async (req: any) => {
      await param(paramName)
        .isMongoId()
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
        .run(req)
    }
  } as any)

const validateStudentClassificationQuery = validate({
  run: async (req: any) => {
    await Promise.all([
      param('studentId')
        .isMongoId()
        .withMessage('studentId must be a valid MongoDB ObjectId')
        .run(req),
      query('classId')
        .optional()
        .isMongoId()
        .withMessage('classId query param must be a valid MongoDB ObjectId')
        .run(req)
    ])
  }
} as any)

const finalResultRouter = Router()

// ==========================================
// MODULE 7: FINAL RESULT MANAGEMENT ROUTES
// ==========================================

// POST /api/classes/:classId/final-results/calculate - Tính toán điểm tổng kết (Giảng viên)
finalResultRouter.post(
  '/classes/:classId/final-results/calculate',
  requireAuth,
  requireRole('LECTURER'),
  validateObjectIdParam('classId'),
  calculateClassFinalResultsController
)

// GET /api/classes/:classId/final-results - Xem điểm tổng kết của lớp (Giảng viên, Chủ nhiệm bộ môn)
finalResultRouter.get(
  '/classes/:classId/final-results',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getFinalResultsByClassController
)

// GET /api/classes/:classId/final-results/export - Xuất file Excel bảng điểm tổng kết (Giảng viên, Chủ nhiệm bộ môn)
finalResultRouter.get(
  '/classes/:classId/final-results/export',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  exportFinalResultsController
)

// GET /api/students/me/results - Xem kết quả học tập của chính mình (Sinh viên)
finalResultRouter.get(
  '/students/me/results',
  requireAuth,
  requireRole('STUDENT'),
  getMyFinalResultsController
)

// GET /api/students/:studentId/classes/:classId/final-result - Xem điểm sinh viên theo lớp (Sinh viên sở hữu, Giảng viên)
finalResultRouter.get(
  '/students/:studentId/classes/:classId/final-result',
  requireAuth,
  requireRole('STUDENT', 'LECTURER'),
  validateObjectIdParam('studentId'),
  validateObjectIdParam('classId'),
  getStudentFinalResultInClassController
)

// ==========================================
// MODULE 8: ACADEMIC CLASSIFICATION ROUTES
// ==========================================

// GET /api/classes/:classId/classifications - Xem thống kê xếp loại lớp (Giảng viên, Chủ nhiệm bộ môn)
finalResultRouter.get(
  '/classes/:classId/classifications',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getClassClassificationsController
)

// GET /api/classes/:classId/rankings - Xem bảng xếp hạng lớp (Giảng viên, Chủ nhiệm bộ môn)
finalResultRouter.get(
  '/classes/:classId/rankings',
  requireAuth,
  requireRole('LECTURER', 'SUBJECT_HEAD'),
  validateObjectIdParam('classId'),
  getClassRankingsController
)

// GET /api/students/:studentId/classification - Xem xếp loại của một sinh viên (Sinh viên sở hữu, Giảng viên)
finalResultRouter.get(
  '/students/:studentId/classification',
  requireAuth,
  requireRole('STUDENT', 'LECTURER'),
  validateStudentClassificationQuery,
  getStudentClassificationController
)

export default finalResultRouter
