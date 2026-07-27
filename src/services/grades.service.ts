import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Grade, { GradeType, RubricGradeScore } from '~/models/schemas/grades.schema'
import FinalResult from '~/models/schemas/finalResults.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class GradesService {
  private async assertLecturerOwnsClass(classId: ObjectId, lecturerId: ObjectId) {
    const classData = await databaseService.classes.findOne({
      _id: classId,
      $or: [
        { lecturerId },
        { lecturerId: lecturerId.toHexString() },
        { 'lecturer.lecturerId': lecturerId },
        { 'lecturer.lecturerId': lecturerId.toHexString() }
      ]
    } as any)

    if (!classData) {
      throw new ErrorWithStatus({
        message: 'Only the lecturer assigned to this class can publish its grades',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }

  async gradeSubmission(submissionId: string, payload: Omit<GradeType, 'submissionId'>, userId: string) {
    if (!ObjectId.isValid(submissionId) || !ObjectId.isValid(userId)) {
      throw new ErrorWithStatus({ message: 'Submission or lecturer id is invalid', status: HTTP_STATUS.BAD_REQUEST })
    }
    const submission = await databaseService.submissions.findOne({ _id: new ObjectId(submissionId) })
    if (!submission) {
      throw new Error('Submission not found')
    }

    const lecturerId = new ObjectId(userId)
    await this.assertLecturerOwnsClass(submission.classId, lecturerId)

    const gradeItem = await databaseService.gradeItems.findOne({ _id: submission.gradeItemId })
    if (!gradeItem) {
      throw new ErrorWithStatus({ message: 'Grade item not found', status: HTTP_STATUS.NOT_FOUND })
    }
    const maxScore = Number(gradeItem.maxScore ?? 10)
    if (payload.maxScore !== undefined && Math.abs(Number(payload.maxScore) - maxScore) > 0.001) {
      throw new ErrorWithStatus({
        message: `maxScore must match the configured grade item maxScore (${maxScore})`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const score = Number(payload.score)
    if (!Number.isFinite(score) || score < 0 || score > maxScore) {
      throw new ErrorWithStatus({
        message: `Score must be between 0 and ${maxScore}`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const configuredRubric = Array.isArray(gradeItem.rubric) ? gradeItem.rubric : []
    let rubricScores: RubricGradeScore[] = []
    if (configuredRubric.length > 0) {
      if (!Array.isArray(payload.rubricScores) || payload.rubricScores.length !== configuredRubric.length) {
        throw new ErrorWithStatus({
          message: 'A score for every configured rubric criterion is required',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      const receivedById = new Map(payload.rubricScores.map(item => [String(item.criterionId), item]))
      rubricScores = configuredRubric.map(criterion => {
        const received = receivedById.get(criterion.id)
        const criterionScore = Number(received?.score)
        if (!received || !Number.isFinite(criterionScore) || criterionScore < 0 || criterionScore > criterion.maxPoints) {
          throw new ErrorWithStatus({
            message: `Invalid score for rubric criterion ${criterion.name}`,
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
        return {
          criterionId: criterion.id,
          name: criterion.name,
          score: Number(criterionScore.toFixed(2)),
          maxPoints: criterion.maxPoints,
          comment: String(received.comment || '').trim()
        }
      })
      const rubricTotal = Number(rubricScores.reduce((sum, item) => sum + item.score, 0).toFixed(2))
      if (Math.abs(rubricTotal - score) > 0.01) {
        throw new ErrorWithStatus({
          message: `Final score (${score}) must equal the rubric score total (${rubricTotal})`,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    let aiAdvisoryRunId: ObjectId | undefined
    if (payload.aiAdvisoryRunId) {
      if (!ObjectId.isValid(payload.aiAdvisoryRunId)) {
        throw new ErrorWithStatus({ message: 'AI advisory run id is invalid', status: HTTP_STATUS.BAD_REQUEST })
      }
      aiAdvisoryRunId = new ObjectId(payload.aiAdvisoryRunId)
      const advisoryRun = await databaseService.aiAdvisoryRuns.findOne({
        _id: aiAdvisoryRunId,
        submissionId: submission._id,
        type: { $in: ['aiGradingSuggestion', 'aiHolisticSuggestion'] }
      })
      if (!advisoryRun) {
        throw new ErrorWithStatus({ message: 'AI advisory run is invalid for this submission', status: HTTP_STATUS.BAD_REQUEST })
      }
      const suggestedScore = Number(
        advisoryRun.result?.holisticRecommendedScore ?? advisoryRun.result?.suggestedScore
      )
      if (
        Number.isFinite(suggestedScore) &&
        Math.abs(suggestedScore - score) > 0.01 &&
        !String(payload.lecturerAdjustmentReason || '').trim()
      ) {
        throw new ErrorWithStatus({
          message: 'Please provide a reason when the lecturer score differs from the AI suggestion',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    const gradeDecision = {
      score,
      maxScore,
      feedback: payload.feedback,
      rubricScores,
      aiAdvisoryRunId,
      lecturerAdjustmentReason: String(payload.lecturerAdjustmentReason || '').trim(),
      publishedAt: new Date()
    }

    if (payload.studentId && !ObjectId.isValid(payload.studentId)) {
      throw new ErrorWithStatus({ message: 'Student id is invalid', status: HTTP_STATUS.BAD_REQUEST })
    }
    const targetStudentId = payload.studentId ? new ObjectId(payload.studentId) : submission.studentId
    const studentIdsToGrade = [targetStudentId]

    // If grading the representative (target is the submission owner), also grade all group members
    if (targetStudentId.toString() === submission.studentId.toString() && submission.groupMembers && submission.groupMembers.length > 0) {
      studentIdsToGrade.push(...submission.groupMembers)
    }

    const results = []

    for (const sId of studentIdsToGrade) {
      const existingGrade = await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: sId 
      })
      
      if (existingGrade) {
        const result = await databaseService.grades.findOneAndUpdate(
          { _id: existingGrade._id },
          {
            $set: {
              ...gradeDecision,
              studentId: sId,
              classId: submission.classId,
              gradeItemId: submission.gradeItemId,
              gradedBy: lecturerId,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )
        results.push(result)
      } else {
        const newGrade = new Grade({
          ...payload,
          ...gradeDecision,
          submissionId: new ObjectId(submissionId),
          studentId: sId,
          classId: submission.classId,
          gradeItemId: submission.gradeItemId,
          gradedBy: lecturerId
        })
        const result = await databaseService.grades.insertOne(newGrade)
        results.push({ ...newGrade, _id: result.insertedId })
      }
    }

    // Update the submission status to 'graded'
    await databaseService.submissions.updateOne(
      { _id: new ObjectId(submissionId) },
      { $set: { status: 'graded', updatedAt: new Date() } }
    )

    // Return the result for the specific target student, or the first one
    return results[0]
  }

  async getGradeBySubmission(submissionId: string, user?: any, targetStudentId?: string) {
    if (!ObjectId.isValid(submissionId)) {
      throw new ErrorWithStatus({ message: 'Submission id is invalid', status: HTTP_STATUS.BAD_REQUEST })
    }
    const submission = await databaseService.submissions.findOne({ _id: new ObjectId(submissionId) })
    if (!submission) return null

    if (user && user.role === 'STUDENT') {
      return await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: user._id
      })
    }

    if (user?.role === 'LECTURER') {
      await this.assertLecturerOwnsClass(submission.classId, user._id)
    } else if (!['ADMIN', 'SUBJECT_HEAD'].includes(user?.role)) {
      throw new ErrorWithStatus({ message: 'You do not have permission to view this grade', status: HTTP_STATUS.FORBIDDEN })
    }
    
    // For Lecturer/Admin, if targetStudentId is provided, return that specific student's grade
    if (targetStudentId) {
      if (!ObjectId.isValid(targetStudentId)) {
        throw new ErrorWithStatus({ message: 'Student id is invalid', status: HTTP_STATUS.BAD_REQUEST })
      }
      return await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: new ObjectId(targetStudentId)
      })
    }

    // Otherwise return the grade of the submission owner
    return await databaseService.grades.findOne({ 
      submissionId: new ObjectId(submissionId),
      studentId: submission.studentId
    })
  }

  async deleteGradeBySubmission(submissionId: string, userId: string) {
    const submission = await databaseService.submissions.findOne({ _id: new ObjectId(submissionId) })
    if (!submission) return null
    await this.assertLecturerOwnsClass(submission.classId, new ObjectId(userId))
    return await databaseService.grades.findOneAndDelete({ submissionId: new ObjectId(submissionId) })
  }

  async getGradesByGradeItem(gradeItemId: string) {
    return await databaseService.grades.find({ gradeItemId: new ObjectId(gradeItemId) }).toArray()
  }

  async getGradesByClass(classId: string) {
    return await databaseService.grades.find({ classId: new ObjectId(classId) }).toArray()
  }

  async calculateFinalResult(studentId: string, classId: string) {
    // 1. Get all grade items for the class to know their weights
    const gradeItems = await databaseService.gradeItems.find({ classId: new ObjectId(classId) }).toArray()
    
    // 2. Get all grades for this student in this class
    const grades = await databaseService.grades.find({ 
      classId: new ObjectId(classId),
      studentId: new ObjectId(studentId)
    }).toArray()

    let totalScore = 0

    gradeItems.forEach(item => {
      const studentGrade = grades.find(g => g.gradeItemId.toString() === item._id?.toString())
      if (studentGrade) {
        // Calculate weighted score: (score / maxScore) * 10 * (weight / 100)
        const itemScore = (studentGrade.score / studentGrade.maxScore) * 10 * (item.weight / 100)
        totalScore += itemScore
      }
    })

    // Determine classification
    let classification: 'poor' | 'average' | 'good' | 'very_good' | 'excellent' = 'poor'
    if (totalScore >= 9.0) classification = 'excellent'
    else if (totalScore >= 8.0) classification = 'very_good'
    else if (totalScore >= 6.5) classification = 'good'
    else if (totalScore >= 5.0) classification = 'average'

    // Save or update final result
    const finalResultPayload = {
      studentId: new ObjectId(studentId),
      classId: new ObjectId(classId),
      finalScore: Number(totalScore.toFixed(2)),
      classification,
      calculatedAt: new Date()
    }

    const existingResult = await databaseService.finalResults.findOne({ 
      studentId: new ObjectId(studentId),
      classId: new ObjectId(classId)
    })

    if (existingResult) {
      return await databaseService.finalResults.findOneAndUpdate(
        { _id: existingResult._id },
        { $set: finalResultPayload },
        { returnDocument: 'after' }
      )
    }

    const newFinalResult = new FinalResult(finalResultPayload)
    const result = await databaseService.finalResults.insertOne(newFinalResult)
    return { ...newFinalResult, _id: result.insertedId }
  }
}

const gradesService = new GradesService()
export default gradesService
