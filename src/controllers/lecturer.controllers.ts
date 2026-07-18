import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import lecturerService from '~/services/lecturer.services'

export const getLecturerHomeController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const result = await lecturerService.getHome(lecturerId)
    res.json({
      message: 'Get lecturer home successfully',
      result
    })
  }
)

export const getClassOverviewController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const result = await lecturerService.getClassOverview(lecturerId, classId)
    res.json({
      message: 'Get class overview successfully',
      result
    })
  }
)

export const getSubmissionStatisticsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const result = await lecturerService.getSubmissionStatistics(lecturerId, classId)
    res.json({
      message: 'Get submission statistics successfully',
      result
    })
  }
)

export const getAiStatisticsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const result = await lecturerService.getAiStatistics(lecturerId, classId)
    res.json({
      message: 'Get AI statistics successfully',
      result
    })
  }
)

export const submitGradeReportController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const lecturerId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const note = req.body?.note as string | undefined
    const result = await lecturerService.submitGradeReport(lecturerId, classId, note)
    res.json({
      message: 'Grade report submitted to subject head successfully',
      result
    })
  }
)
