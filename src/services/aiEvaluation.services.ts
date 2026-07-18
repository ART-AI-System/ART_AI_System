import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import AiEvaluation, { AiUsagePatternType, RiskLevelType } from '~/models/schemas/aiEvaluations.schema'
import SubmissionFlag, { FlagType } from '~/models/schemas/submissionFlags.schema'
import databaseService from '~/services/database.service'

function toObjectId(id: string, entityName: string) {
  if (!ObjectId.isValid(id)) {
    throw new ErrorWithStatus({
      message: `${entityName} id is invalid`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  return new ObjectId(id)
}

class AiEvaluationService {
  async evaluateSubmission(submissionId: string, evaluatorId: string, role: string) {
    const submissionOid = toObjectId(submissionId, 'Submission')
    const evaluatorOid = toObjectId(evaluatorId, 'Evaluator')

    const submission = await databaseService.submissions.findOne({ _id: submissionOid })
    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (submission.status === 'draft') {
      throw new ErrorWithStatus({
        message: 'Cannot evaluate a draft submission',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (role === 'STUDENT') {
      throw new ErrorWithStatus({
        message: 'Students are not authorized to evaluate AI usage',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (role === 'LECTURER') {
      const classData = await databaseService.classes.findOne({
        _id: submission.classId,
        'lecturer.lecturerId': evaluatorOid
      })
      if (!classData) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to evaluate submissions for this class',
          status: HTTP_STATUS.FORBIDDEN
        })
      }
    }

    const interactions = await databaseService.aiInteractions.find({ submissionId: submissionOid }).toArray()

    let promptQualityScore = 0
    let reflectionQualityScore = 0
    let criticalThinkingScore = 0
    let aiDependencyScore = 0
    let transparencyScore = 0
    let pattern: AiUsagePatternType = 'passive_usage'
    let riskLevel: RiskLevelType = 'low'
    let summary = ''

    const count = interactions.length

    if (count > 0) {
      const totalPromptLength = interactions.reduce((sum, item) => sum + item.promptContent.length, 0)
      const avgPromptLength = totalPromptLength / count
      if (avgPromptLength >= 100) {
        promptQualityScore = Math.min(100, 70 + Math.round((avgPromptLength - 100) / 5))
      } else if (avgPromptLength >= 40) {
        promptQualityScore = 50 + Math.round((avgPromptLength - 40) / 2)
      } else {
        promptQualityScore = Math.max(10, Math.round(avgPromptLength * 1.2))
      }

      const totalReflectionLength = interactions.reduce((sum, item) => sum + item.reflectionText.length, 0)
      const avgReflectionLength = totalReflectionLength / count
      if (avgReflectionLength >= 150) {
        reflectionQualityScore = Math.min(100, 75 + Math.round((avgReflectionLength - 150) / 6))
      } else if (avgReflectionLength >= 50) {
        reflectionQualityScore = 50 + Math.round((avgReflectionLength - 50) / 4)
      } else {
        reflectionQualityScore = Math.max(10, Math.round(avgReflectionLength * 1.0))
      }

      const totalDecisionScore = interactions.reduce((sum, item) => {
        if (item.studentDecision === 'partially_accepted') return sum + 100
        if (item.studentDecision === 'reference_only') return sum + 90
        if (item.studentDecision === 'rejected') return sum + 80
        return sum + 40 // accepted
      }, 0)
      criticalThinkingScore = Math.round(totalDecisionScore / count)

      const acceptedCount = interactions.filter((item) => item.studentDecision === 'accepted').length
      const acceptedRatio = acceptedCount / count
      if (count > 8 && acceptedRatio > 0.8) {
        aiDependencyScore = 80
      } else if (count > 5 && acceptedRatio > 0.6) {
        aiDependencyScore = 60
      } else {
        aiDependencyScore = Math.round(acceptedRatio * 50)
      }

      transparencyScore = Math.round(
        (promptQualityScore + reflectionQualityScore + criticalThinkingScore + (100 - aiDependencyScore)) / 4
      )

      if (aiDependencyScore >= 70) {
        pattern = 'high_dependency'
      } else if (criticalThinkingScore >= 75) {
        pattern = 'critical_engagement'
      } else if (interactions.some((item) => item.studentDecision === 'partially_accepted' || item.studentDecision === 'reference_only')) {
        pattern = 'collaborative_usage'
      } else {
        pattern = 'passive_usage'
      }

      if (aiDependencyScore >= 70) {
        riskLevel = 'high'
      } else if (aiDependencyScore >= 40) {
        riskLevel = 'medium'
      } else {
        riskLevel = 'low'
      }

      if (pattern === 'high_dependency') {
        summary = 'Student shows high dependency on GenAI with passive acceptance of outputs.'
      } else if (pattern === 'critical_engagement') {
        summary = 'Student demonstrates high critical engagement and reflective reasoning on AI outputs.'
      } else if (pattern === 'collaborative_usage') {
        summary = 'Student demonstrates productive and collaborative usage of AI assistance.'
      } else {
        summary = 'Student demonstrates passive AI usage. Prompts and reflections could be improved.'
      }
    } else {
      promptQualityScore = 0
      reflectionQualityScore = 0
      criticalThinkingScore = 0
      aiDependencyScore = 0
      transparencyScore = 0
      pattern = 'passive_usage'
      riskLevel = 'low'
      summary = 'No AI interactions declared for this submission.'
    }

    const evaluationPayload = {
      submissionId: submissionOid,
      gradeItemId: submission.gradeItemId,
      studentId: submission.studentId,
      classId: submission.classId,
      pattern,
      riskLevel,
      transparencyScore,
      promptQualityScore,
      reflectionQualityScore,
      criticalThinkingScore,
      aiDependencyScore,
      summary,
      evaluatedAt: new Date()
    }

    const existingEvaluation = await databaseService.aiEvaluations.findOne({ submissionId: submissionOid })
    let evaluationResult
    if (existingEvaluation) {
      evaluationResult = await databaseService.aiEvaluations.findOneAndUpdate(
        { _id: existingEvaluation._id },
        { $set: { ...evaluationPayload, updatedAt: new Date() } },
        { returnDocument: 'after' }
      )
    } else {
      const newEvaluation = new AiEvaluation(evaluationPayload)
      const insertResult = await databaseService.aiEvaluations.insertOne(newEvaluation)
      evaluationResult = { ...newEvaluation, _id: insertResult.insertedId }
    }

    await this.processFlags(submission, evaluationResult)

    if (submission.status === 'submitted' || submission.status === 'late') {
      await databaseService.submissions.updateOne(
        { _id: submissionOid },
        { $set: { status: 'evaluated', updatedAt: new Date() } }
      )
    }

    return evaluationResult
  }

  private async processFlags(submission: any, evaluation: any) {
    const classId = submission.classId
    const studentId = submission.studentId
    const submissionId = submission._id
    const gradeItemId = submission.gradeItemId

    const existingFlags = await databaseService.submissionFlags.find({ submissionId }).toArray()

    const flagConditions: Array<{ flagType: FlagType; description: string; suspectLevel: RiskLevelType }> = []

    if (evaluation.promptQualityScore < 40 && evaluation.promptQualityScore > 0) {
      flagConditions.push({
        flagType: 'low_quality_prompt',
        description: `Average prompt quality score is low: ${evaluation.promptQualityScore}`,
        suspectLevel: 'medium'
      })
    }

    if (evaluation.aiDependencyScore >= 70) {
      flagConditions.push({
        flagType: 'high_ai_dependency',
        description: `Student demonstrates high AI dependency: ${evaluation.aiDependencyScore}`,
        suspectLevel: 'high'
      })
    }

    if (evaluation.reflectionQualityScore < 40 && evaluation.reflectionQualityScore > 0) {
      flagConditions.push({
        flagType: 'weak_reflection',
        description: `Average reflection quality score is low: ${evaluation.reflectionQualityScore}`,
        suspectLevel: 'medium'
      })
    }

    const interactions = await databaseService.aiInteractions.find({ submissionId }).toArray()
    if (interactions.length > 0 && interactions.every((item) => item.studentDecision === 'accepted')) {
      flagConditions.push({
        flagType: 'all_responses_accepted',
        description: 'All AI responses were accepted without modification or rejection.',
        suspectLevel: 'low'
      })
    }

    const gradeItem = await databaseService.gradeItems.findOne({ _id: gradeItemId })
    if (gradeItem?.aiInteractionRequired && interactions.length === 0) {
      flagConditions.push({
        flagType: 'missing_ai_interactions',
        description: 'AI interactions are required but none were declared.',
        suspectLevel: 'high'
      })
    }

    for (const condition of flagConditions) {
      const match = existingFlags.find((f) => f.flagType === condition.flagType)
      if (!match) {
        const flag = new SubmissionFlag({
          submissionId,
          gradeItemId,
          studentId,
          classId,
          flagType: condition.flagType,
          description: condition.description,
          flaggedBy: 'system',
          suspectLevel: condition.suspectLevel,
          status: 'open'
        })
        await databaseService.submissionFlags.insertOne(flag)
      }
    }
  }

  async getEvaluationBySubmission(submissionId: string, userId: string, role: string) {
    const submissionOid = toObjectId(submissionId, 'Submission')
    const userOid = toObjectId(userId, 'User')

    const submission = await databaseService.submissions.findOne({ _id: submissionOid })
    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.assertCanViewSubmission(submission, userOid, role)

    const evaluation = await databaseService.aiEvaluations.findOne({ submissionId: submissionOid })
    if (!evaluation) {
      throw new ErrorWithStatus({
        message: 'AI Evaluation not found for this submission',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return evaluation
  }

  async getEvaluationsByClass(classId: string, userId: string, role: string) {
    const classOid = toObjectId(classId, 'Class')
    const userOid = toObjectId(userId, 'User')

    if (role === 'STUDENT') {
      throw new ErrorWithStatus({
        message: 'Students are not authorized to view class evaluations',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (role === 'LECTURER') {
      const classData = await databaseService.classes.findOne({
        _id: classOid,
        'lecturer.lecturerId': userOid
      })
      if (!classData) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to view evaluations for this class',
          status: HTTP_STATUS.FORBIDDEN
        })
      }
    }

    const evaluations = await databaseService.aiEvaluations.find({ classId: classOid }).toArray()
    return evaluations
  }

  async getEvaluationsByStudent(studentId: string, userId: string, role: string) {
    const studentOid = toObjectId(studentId, 'Student')
    const userOid = toObjectId(userId, 'User')

    if (role === 'STUDENT' && studentId !== userId) {
      throw new ErrorWithStatus({
        message: 'You can only view your own evaluations',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (role === 'LECTURER') {
      const classes = await databaseService.classes
        .find({
          'lecturer.lecturerId': userOid,
          'students.studentId': studentOid
        })
        .toArray()
      if (classes.length === 0) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to view this student\'s evaluations',
          status: HTTP_STATUS.FORBIDDEN
        })
      }
    }

    const evaluations = await databaseService.aiEvaluations.find({ studentId: studentOid }).toArray()
    return evaluations
  }

  private async assertCanViewSubmission(submission: any, userId: ObjectId, role: string) {
    if (submission.status === 'draft' && submission.studentId.toString() !== userId.toString()) {
      throw new ErrorWithStatus({
        message: 'Draft submissions are only visible to the owner student',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (role === 'ADMIN' || role === 'SUBJECT_HEAD') {
      return
    }

    if (role === 'STUDENT' && submission.studentId.toString() === userId.toString()) {
      return
    }

    if (role === 'LECTURER') {
      const classData = await databaseService.classes.findOne({
        _id: submission.classId,
        'lecturer.lecturerId': userId
      })

      if (classData) {
        return
      }
    }

    throw new ErrorWithStatus({
      message: 'You do not have permission to access evaluations for this submission',
      status: HTTP_STATUS.FORBIDDEN
    })
  }
}

const aiEvaluationService = new AiEvaluationService()
export default aiEvaluationService
