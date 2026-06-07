import { Request, Response, NextFunction } from 'express'
import gradesService from '~/services/grades.service'

export const gradeSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: submissionId } = req.params
    const result = await gradesService.gradeSubmission(submissionId as string, req.body)
    res.status(200).json({
      message: 'Grade submitted successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getGradeBySubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: submissionId } = req.params
    const result = await gradesService.getGradeBySubmission(submissionId as string)
    if (!result) {
      res.status(404).json({ message: 'Grade not found for this submission' })
      return
    }
    res.json({
      message: 'Get grade successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteGradeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: submissionId } = req.params
    const result = await gradesService.deleteGradeBySubmission(submissionId as string)
    if (!result) {
      res.status(404).json({ message: 'Grade not found' })
      return
    }
    res.json({
      message: 'Delete grade successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getGradesByGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeItemId } = req.params
    const result = await gradesService.getGradesByGradeItem(gradeItemId as string)
    res.json({
      message: 'Get grades for grade item successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getGradesByClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const result = await gradesService.getGradesByClass(classId as string)
    res.json({
      message: 'Get grades for class successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const calculateFinalResultController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId, studentId } = req.params
    const result = await gradesService.calculateFinalResult(studentId as string, classId as string)
    res.json({
      message: 'Calculate final result successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
