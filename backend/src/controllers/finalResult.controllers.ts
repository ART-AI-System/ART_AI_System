import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import finalResultService from '~/services/finalResult.services'
import reportService from '~/services/report.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

// Helper to resolve filename for exports
async function resolveFilename(classId: string): Promise<string> {
  const classMeta = await reportService.getClassMeta(classId)
  return classMeta?.classCode
    ? classMeta.classCode.replace(/[^a-zA-Z0-9\-_]/g, '_')
    : classId
}

/**
 * POST /api/classes/:classId/final-results/calculate
 * Tính điểm tổng kết cho cả lớp học (Giảng viên)
 */
export const calculateClassFinalResultsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params.classId as string
    const results = await finalResultService.calculateClassFinalResults(classId)
    res.status(200).json({
      message: 'Tính điểm tổng kết lớp thành công',
      results
    })
  }
)

/**
 * GET /api/classes/:classId/final-results
 * Xem bảng điểm tổng kết của cả lớp (Giảng viên, Chủ nhiệm bộ môn)
 */
export const getFinalResultsByClassController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params.classId as string
    const result = await finalResultService.getFinalResultsByClass(classId)
    res.status(200).json({
      message: 'Lấy bảng điểm tổng kết lớp thành công',
      result
    })
  }
)

/**
 * GET /api/students/:studentId/classes/:classId/final-result
 * Lấy điểm tổng kết của một sinh viên cụ thể trong một lớp (Sinh viên sở hữu, Giảng viên)
 */
export const getStudentFinalResultInClassController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = req.params.studentId as string
    const classId = req.params.classId as string
    const currentUser = req.user

    // Kiểm tra quyền: Sinh viên chỉ được xem của chính mình
    if (currentUser?.role === 'STUDENT' && currentUser._id?.toString() !== studentId) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xem điểm của sinh viên khác',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const result = await finalResultService.getStudentFinalResultInClass(studentId, classId)
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy kết quả học tập của sinh viên trong lớp này',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    res.status(200).json({
      message: 'Lấy điểm tổng kết sinh viên thành công',
      result
    })
  }
)

/**
 * GET /api/classes/:classId/final-results/export
 * Xuất kết quả tổng kết lớp ra file Excel (Giảng viên, Chủ nhiệm bộ môn)
 */
export const exportFinalResultsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params.classId as string
    const [buffer, filename] = await Promise.all([
      reportService.exportExcel(classId),
      resolveFilename(classId)
    ])

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename="class-${filename}-final-results.xlsx"`)
    res.setHeader('Content-Length', buffer.length)
    res.send(buffer)
  }
)

/**
 * GET /api/students/me/results
 * Xem điểm tổng kết của chính sinh viên đang đăng nhập ở tất cả lớp học
 */
export const getMyFinalResultsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = req.user?._id?.toString() as string
    const result = await finalResultService.getMyFinalResults(studentId)
    res.status(200).json({
      message: 'Lấy danh sách điểm tổng kết của bạn thành công',
      result
    })
  }
)

/**
 * GET /api/classes/:classId/classifications
 * Xem phân phối xếp loại học lực của cả lớp (Giảng viên, Chủ nhiệm bộ môn)
 */
export const getClassClassificationsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params.classId as string
    const result = await finalResultService.getClassifications(classId)
    res.status(200).json({
      message: 'Lấy phân phối xếp loại lớp thành công',
      result
    })
  }
)

/**
 * GET /api/classes/:classId/rankings
 * Xem bảng xếp hạng sinh viên trong lớp (Giảng viên, Chủ nhiệm bộ môn)
 */
export const getClassRankingsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params.classId as string
    const result = await finalResultService.getRankings(classId)
    res.status(200).json({
      message: 'Lấy bảng xếp hạng lớp thành công',
      result
    })
  }
)

/**
 * GET /api/students/:studentId/classification
 * Xem xếp loại học lực của sinh viên (Sinh viên sở hữu, Giảng viên)
 */
export const getStudentClassificationController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = req.params.studentId as string
    const classId = req.query.classId as string | undefined
    const currentUser = req.user

    // Kiểm tra quyền: Sinh viên chỉ được xem của chính mình
    if (currentUser?.role === 'STUDENT' && currentUser._id?.toString() !== studentId) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xem thông tin xếp loại của sinh viên khác',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const result = await finalResultService.getStudentClassification(studentId, classId)
    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy thông tin xếp loại',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    res.status(200).json({
      message: 'Lấy xếp loại sinh viên thành công',
      result
    })
  }
)
