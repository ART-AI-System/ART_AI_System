import { Request, Response, NextFunction } from 'express'
import sessionService from '~/services/session.service'
import scheduleService from '~/services/schedule.service'

export const getSessionsByClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classId = req.params.classId as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await sessionService.getSessionsByClassId(classId, page, limit)
    res.json({
      message: 'Get sessions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const createSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classId = req.params.classId as string
    // In production we should validate payload using Joi/Zod or express-validator
    // For now we pass req.body directly as per current pattern
    const payload = {
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime)
    }
    
    const result = await sessionService.createSession(classId, payload)
    res.status(201).json({
      message: 'Create session successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSessionByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const result = await sessionService.getSessionById(id)
    if (!result) {
      res.status(404).json({ message: 'Session not found' })
      return
    }
    res.json({
      message: 'Get session successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const payload = { ...req.body }
    if (payload.startTime) payload.startTime = new Date(payload.startTime)
    if (payload.endTime) payload.endTime = new Date(payload.endTime)

    const result = await sessionService.updateSession(id, payload)
    if (!result) {
      res.status(404).json({ message: 'Session not found' })
      return
    }
    res.json({
      message: 'Update session successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const result = await sessionService.deleteSession(id)
    if (!result) {
      res.status(404).json({ message: 'Session not found' })
      return
    }
    res.json({
      message: 'Delete session successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getStudentScheduleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = (req.user as any)?._id?.toHexString() || (req as any).decoded_authorization?.user_id
    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { startDate, endDate } = req.query
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'startDate and endDate are required' })
      return
    }

    const result = await scheduleService.getStudentSchedule(
      studentId as string,
      startDate as string,
      endDate as string
    )
    
    res.json({
      message: 'Get student schedule successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
