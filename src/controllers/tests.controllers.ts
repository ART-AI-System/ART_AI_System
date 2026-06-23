import { Request, Response } from 'express'
import { testsService } from '~/services/tests.service'

export const createTestController = async (req: Request, res: Response) => {
  const classId = req.params.classId as string
  const result = await testsService.createTest(classId, req.body)
  res.json({ message: 'Create test successfully', result })
}

export const getTestsByClassController = async (req: Request, res: Response) => {
  const classId = req.params.classId as string
  const result = await testsService.getTestsByClassId(classId)
  res.json({ message: 'Get tests successfully', result })
}

export const getTestForLecturerController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  const result = await testsService.getTestByIdForLecturer(testId)
  if (!result) {
    return res.status(404).json({ message: 'Test not found' })
  }
  res.json({ message: 'Get test successfully', result })
}

export const getTestForStudentController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  const result = await testsService.getTestByIdForStudent(testId)
  if (!result) {
    return res.status(404).json({ message: 'Test not found' })
  }
  res.json({ message: 'Get test successfully (answers hidden)', result })
}

export const deleteTestController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  try {
    const result = await testsService.deleteTest(testId)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const startAttemptController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  const classId = req.body.classId
  const studentId = (req as any).user._id.toString()
  const result = await testsService.startAttempt(testId, studentId, classId)
  res.json({ message: 'Exam started, Anti-cheat active', result })
}

export const reportCheatController = async (req: Request, res: Response) => {
  const attemptId = req.params.attemptId as string
  const studentId = (req as any).user._id.toString()
  const result = await testsService.reportCheat(attemptId, studentId)
  res.json({ message: 'Cheat incident reported', result })
}

export const submitAttemptController = async (req: Request, res: Response) => {
  const attemptId = req.params.attemptId as string
  const studentId = (req as any).user._id.toString()
  try {
    const result = await testsService.submitAttempt(attemptId, studentId, req.body)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getAttemptResultController = async (req: Request, res: Response) => {
  const attemptId = req.params.attemptId as string
  const studentId = (req as any).user._id.toString()
  try {
    const result = await testsService.getAttemptResult(attemptId, studentId)
    res.json({ message: 'Get result successfully', result })
  } catch (error: any) {
    res.status(403).json({ message: error.message })
  }
}

export const getTestAnalyticsController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  try {
    const result = await testsService.getTestAnalytics(testId)
    res.json({ message: 'Get analytics successfully', result })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const overrideScoreController = async (req: Request, res: Response) => {
  const attemptId = req.params.attemptId as string
  const score = req.body.score
  try {
    const result = await testsService.overrideScore(attemptId, score)
    res.json({ message: 'Score manually overridden successfully', result })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const exportGradesController = async (req: Request, res: Response) => {
  const testId = req.params.testId as string
  const gradeItemId = req.body.gradeItemId
  const lecturerId = (req as any).user._id.toString()
  try {
    const result = await testsService.exportGrades(testId, gradeItemId, lecturerId)
    res.json({ message: 'Grades exported to Gradebook successfully', result })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
