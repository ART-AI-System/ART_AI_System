import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import subjectHeadService from '~/services/subjectHead.services'

export const getOverviewController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const semester = req.query['semester'] as string | undefined
    const result = await subjectHeadService.getOverview(subjectHeadId, semester)
    res.json({
      message: 'Get subject head overview successfully',
      result
    })
  }
)

export const getClassesController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const semester = req.query['semester'] as string | undefined
    const result = await subjectHeadService.getClasses(subjectHeadId, semester)
    res.json({
      message: 'Get classes successfully',
      result
    })
  }
)

export const getClassAnalyticsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const result = await subjectHeadService.getClassAnalytics(subjectHeadId, classId)
    res.json({
      message: 'Get class analytics successfully',
      result
    })
  }
)

export const getSubjectAnalyticsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const subjectId = req.params['subjectId'] as string
    const result = await subjectHeadService.getSubjectAnalytics(subjectHeadId, subjectId)
    res.json({
      message: 'Get subject analytics successfully',
      result
    })
  }
)

export const getStudentDetailController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const studentId = req.params['studentId'] as string
    const result = await subjectHeadService.getStudentDetail(subjectHeadId, studentId)
    res.json({
      message: 'Get student detail successfully',
      result
    })
  }
)

export const getLecturerAnalyticsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const lecturerId = req.params['lecturerId'] as string
    const result = await subjectHeadService.getLecturerAnalytics(subjectHeadId, lecturerId)
    res.json({
      message: 'Get lecturer analytics successfully',
      result
    })
  }
)

export const getGradeReportsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const status = req.query['status'] as string | undefined
    const result = await subjectHeadService.getGradeReports(subjectHeadId, status)
    res.json({
      message: 'Get grade reports successfully',
      result
    })
  }
)

export const reviewGradeReportController = (action: 'approve' | 'reject' | 'reopen') =>
  wrapRequestHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const subjectHeadId = (req.user!._id as any).toHexString()
    const reportId = req.params['reportId'] as string
    const reviewNote = req.body?.reviewNote as string | undefined
    const result = await subjectHeadService.reviewGradeReport(
      subjectHeadId,
      reportId,
      action,
      reviewNote
    )
    res.json({
      message: `Grade report ${action === 'reopen' ? 'reopened' : action + 'd'} successfully`,
      result
    })
  })
