import { Request, Response, NextFunction } from 'express'
import User from '~/models/schemas/users.schema'
import aiEvaluationService from '~/services/aiEvaluation.services'

export const evaluateSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiEvaluationService.evaluateSubmission(
      submissionId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Evaluate AI usage successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const recalculateEvaluationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiEvaluationService.evaluateSubmission(
      submissionId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Recalculate AI evaluation successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getEvaluationBySubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiEvaluationService.getEvaluationBySubmission(
      submissionId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Get AI evaluation successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getEvaluationsByClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const user = req.user as User
    const result = await aiEvaluationService.getEvaluationsByClass(
      classId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Get class AI evaluations successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getEvaluationsByStudentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const user = req.user as User
    const result = await aiEvaluationService.getEvaluationsByStudent(
      studentId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Get student AI evaluations successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
