import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { Test, QuestionSchema, OptionSchema } from '~/models/schemas/tests.schema'
import { TestAttempt, AttemptStatus } from '~/models/schemas/testAttempts.schema'
import { CreateTestReqBody, SubmitTestReqBody } from '~/models/requests/tests.request'

class TestsService {
  async createTest(classId: string, payload: CreateTestReqBody) {
    const questions: QuestionSchema[] = payload.questions.map((q) => {
      const options: OptionSchema[] = q.options.map((o) => ({
        _id: new ObjectId(),
        text: o.text,
        isCorrect: o.isCorrect
      }))
      return {
        _id: new ObjectId(),
        type: q.type,
        text: q.text,
        points: q.points,
        options
      }
    })

    const test: Test = {
      classId: new ObjectId(classId),
      title: payload.title,
      duration: payload.duration,
      totalPoints: payload.totalPoints,
      showResultImmediately: payload.showResultImmediately,
      questions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await databaseService.tests.insertOne(test)
    return await databaseService.tests.findOne({ _id: result.insertedId })
  }

  async getTestsByClassId(classId: string) {
    return await databaseService.tests.find({ classId: new ObjectId(classId) }).sort({ createdAt: -1 }).toArray()
  }

  async getTestByIdForLecturer(testId: string) {
    return await databaseService.tests.findOne({ _id: new ObjectId(testId) })
  }

  async getTestByIdForStudent(testId: string) {
    const test = await databaseService.tests.findOne({ _id: new ObjectId(testId) })
    if (!test) return null

    // Remove isCorrect from options
    test.questions.forEach((q) => {
      q.options.forEach((o) => {
        delete (o as any).isCorrect
      })
    })
    return test
  }

  async deleteTest(testId: string) {
    // Check if any attempts exist
    const attemptCount = await databaseService.testAttempts.countDocuments({ testId: new ObjectId(testId) })
    if (attemptCount > 0) {
      throw new Error('Cannot delete test because there are existing student attempts.')
    }
    await databaseService.tests.deleteOne({ _id: new ObjectId(testId) })
    return { message: 'Test deleted successfully' }
  }

  async startAttempt(testId: string, studentId: string, classId: string) {
    // Check if attempt already exists and is IN_PROGRESS
    const existing = await databaseService.testAttempts.findOne({
      testId: new ObjectId(testId),
      studentId: new ObjectId(studentId),
      status: AttemptStatus.IN_PROGRESS
    })

    if (existing) return existing

    const attempt: TestAttempt = {
      testId: new ObjectId(testId),
      studentId: new ObjectId(studentId),
      classId: new ObjectId(classId),
      startTime: new Date(),
      submitTime: null,
      score: null,
      cheatIncidents: 0,
      status: AttemptStatus.IN_PROGRESS,
      answers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await databaseService.testAttempts.insertOne(attempt)
    return await databaseService.testAttempts.findOne({ _id: result.insertedId })
  }

  async reportCheat(attemptId: string, studentId: string) {
    const result = await databaseService.testAttempts.findOneAndUpdate(
      { _id: new ObjectId(attemptId), studentId: new ObjectId(studentId), status: AttemptStatus.IN_PROGRESS },
      { $inc: { cheatIncidents: 1 }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    return result
  }

  async submitAttempt(attemptId: string, studentId: string, payload: SubmitTestReqBody) {
    const attempt = await databaseService.testAttempts.findOne({
      _id: new ObjectId(attemptId),
      studentId: new ObjectId(studentId),
      status: AttemptStatus.IN_PROGRESS
    })
    if (!attempt) throw new Error('Attempt not found or already submitted')

    const test = await databaseService.tests.findOne({ _id: attempt.testId })
    if (!test) throw new Error('Test not found')

    // Auto grading
    let totalScore = 0
    const answers = payload.answers.map((ans) => {
      const q = test.questions.find((q) => q._id.toString() === ans.questionId)
      if (!q) return { questionId: new ObjectId(ans.questionId), selectedOptionIds: ans.selectedOptionIds }

      const correctOptionIds = q.options.filter((o) => o.isCorrect).map((o) => o._id.toString())
      const selectedOptionIds = ans.selectedOptionIds

      // Check exact match
      const isCorrect =
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every((id) => selectedOptionIds.includes(id))

      if (isCorrect) {
        totalScore += q.points
      }

      return {
        questionId: new ObjectId(ans.questionId),
        selectedOptionIds
      }
    })

    const finalScore = Math.min(totalScore, test.totalPoints) // cap at totalPoints just in case

    const result = await databaseService.testAttempts.findOneAndUpdate(
      { _id: new ObjectId(attemptId) },
      {
        $set: {
          status: AttemptStatus.SUBMITTED,
          submitTime: new Date(),
          score: finalScore,
          answers,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    // Check visibility
    if (!test.showResultImmediately) {
      const maskedResult = { ...result }
      delete (maskedResult as any).score
      delete (maskedResult as any).answers
      return { attempt: maskedResult, message: 'Submitted successfully. Result hidden.' }
    }

    return { attempt: result, message: 'Submitted successfully. Result available.' }
  }

  async getAttemptResult(attemptId: string, studentId: string) {
    const attempt = await databaseService.testAttempts.findOne({
      _id: new ObjectId(attemptId),
      studentId: new ObjectId(studentId)
    })
    if (!attempt) throw new Error('Attempt not found')

    const test = await databaseService.tests.findOne({ _id: attempt.testId })
    if (!test) throw new Error('Test not found')

    if (!test.showResultImmediately) {
      throw new Error('Test results are hidden by lecturer.')
    }

    return { attempt, test }
  }

  async getTestAnalytics(testId: string) {
    const attempts = await databaseService.testAttempts.find({ testId: new ObjectId(testId), status: AttemptStatus.SUBMITTED }).toArray()
    const test = await databaseService.tests.findOne({ _id: new ObjectId(testId) })

    if (!test) throw new Error('Test not found')

    const totalStudents = await databaseService.classMembers.countDocuments({ classId: test.classId })
    const submittedCount = attempts.length
    
    let maxScore = 0
    let minScore = test.totalPoints
    let totalScoreSum = 0

    const studentScores = attempts.map(a => {
      const s = a.score || 0
      if (s > maxScore) maxScore = s
      if (s < minScore) minScore = s
      totalScoreSum += s
      return { studentId: a.studentId, score: s, cheatIncidents: a.cheatIncidents }
    })

    const avgScore = submittedCount > 0 ? totalScoreSum / submittedCount : 0
    if (submittedCount === 0) minScore = 0

    return {
      completionRate: totalStudents > 0 ? submittedCount / totalStudents : 0,
      avgScore,
      maxScore,
      minScore,
      studentScores
    }
  }
  async overrideScore(attemptId: string, score: number) {
    const result = await databaseService.testAttempts.findOneAndUpdate(
      { _id: new ObjectId(attemptId) },
      { $set: { score, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!result) throw new Error('Attempt not found')
    return result
  }

  async exportGrades(testId: string, gradeItemId: string, lecturerId: string) {
    const attempts = await databaseService.testAttempts.find({
      testId: new ObjectId(testId),
      status: AttemptStatus.SUBMITTED
    }).toArray()
    
    const test = await databaseService.tests.findOne({ _id: new ObjectId(testId) })
    if (!test) throw new Error('Test not found')

    let exportedCount = 0
    for (const attempt of attempts) {
      if (attempt.score !== null) {
        const existingGrade = await databaseService.grades.findOne({ submissionId: attempt._id })
        
        if (existingGrade) {
          await databaseService.grades.updateOne(
            { _id: existingGrade._id },
            {
              $set: {
                score: attempt.score,
                maxScore: test.totalPoints,
                gradedBy: new ObjectId(lecturerId),
                updatedAt: new Date()
              }
            }
          )
        } else {
          await databaseService.grades.insertOne({
            submissionId: attempt._id as ObjectId,
            studentId: attempt.studentId,
            classId: attempt.classId,
            gradeItemId: new ObjectId(gradeItemId),
            score: attempt.score,
            maxScore: test.totalPoints,
            feedback: 'Exported from Auto-graded Quiz',
            gradedBy: new ObjectId(lecturerId),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
        exportedCount++
      }
    }
    return { exportedCount }
  }
}

export const testsService = new TestsService()
