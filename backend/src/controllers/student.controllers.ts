import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import studentService from '~/services/student.services'

export const getStudentHomeController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = (req.user!._id as any).toHexString()
    const result = await studentService.getHome(studentId)
    res.json({
      message: 'Get student home successfully',
      result
    })
  }
)

export const getSubjectsBySemesterController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = (req.user!._id as any).toHexString()
    const semesterId = req.params['semesterId'] as string
    const result = await studentService.getSubjectsBySemester(studentId, semesterId)
    res.json({
      message: 'Get enrolled subjects successfully',
      result
    })
  }
)

export const getClassSessionsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const studentId = (req.user!._id as any).toHexString()
    const classId = req.params['classId'] as string
    const page = parseInt(req.query['page'] as string) || 1
    const limit = parseInt(req.query['limit'] as string) || 10
    const result = await studentService.getClassSessions(studentId, classId, page, limit)
    res.json({
      message: 'Get class sessions successfully',
      result
    })
  }
)
