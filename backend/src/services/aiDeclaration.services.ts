import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import AiInteraction, { AiToolType, UsagePurposeType, StudentDecisionType } from '~/models/schemas/aiInteractions.schema'
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

class AiDeclarationService {
  async createAiInteraction(
    submissionId: string,
    studentId: string,
    payload: {
      aiTool: AiToolType
      usagePurpose: UsagePurposeType
      promptContent: string
      aiResponseSummary: string
      studentDecision: StudentDecisionType
      reflectionText: string
    }
  ) {
    const submissionOid = toObjectId(submissionId, 'Submission')
    const studentOid = toObjectId(studentId, 'Student')

    const submission = await databaseService.submissions.findOne({
      _id: submissionOid,
      studentId: studentOid
    })

    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found or not owned by student',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (submission.status !== 'draft') {
      throw new ErrorWithStatus({
        message: 'Cannot add AI interaction to a finalized submission',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newInteraction = new AiInteraction({
      submissionId: submissionOid,
      gradeItemId: submission.gradeItemId,
      studentId: studentOid,
      aiTool: payload.aiTool,
      usagePurpose: payload.usagePurpose,
      promptContent: payload.promptContent,
      aiResponseSummary: payload.aiResponseSummary,
      studentDecision: payload.studentDecision,
      reflectionText: payload.reflectionText
    })

    const result = await databaseService.aiInteractions.insertOne(newInteraction)
    
    // Increment interaction count in submission
    await databaseService.submissions.updateOne(
      { _id: submissionOid },
      {
        $inc: { aiInteractionCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )

    return { ...newInteraction, _id: result.insertedId }
  }

  async listAiInteractions(submissionId: string, userId: string, role: string) {
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

    const result = await databaseService.aiInteractions.find({ submissionId: submissionOid }).toArray()
    return result
  }

  async getAiInteraction(id: string, userId: string, role: string) {
    const interactionOid = toObjectId(id, 'AI Interaction')
    const userOid = toObjectId(userId, 'User')

    const interaction = await databaseService.aiInteractions.findOne({ _id: interactionOid })
    if (!interaction) {
      throw new ErrorWithStatus({
        message: 'AI Interaction not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const submission = await databaseService.submissions.findOne({ _id: interaction.submissionId })
    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Associated submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.assertCanViewSubmission(submission, userOid, role)
    return interaction
  }

  async updateAiInteraction(
    id: string,
    studentId: string,
    payload: {
      aiTool: AiToolType
      usagePurpose: UsagePurposeType
      promptContent: string
      aiResponseSummary: string
      studentDecision: StudentDecisionType
      reflectionText: string
    }
  ) {
    const interactionOid = toObjectId(id, 'AI Interaction')
    const studentOid = toObjectId(studentId, 'Student')

    const interaction = await databaseService.aiInteractions.findOne({
      _id: interactionOid,
      studentId: studentOid
    })

    if (!interaction) {
      throw new ErrorWithStatus({
        message: 'AI Interaction not found or not owned by student',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const submission = await databaseService.submissions.findOne({ _id: interaction.submissionId })
    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (submission.status !== 'draft') {
      throw new ErrorWithStatus({
        message: 'Cannot update AI interaction of a finalized submission',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await databaseService.aiInteractions.findOneAndUpdate(
      { _id: interactionOid },
      {
        $set: {
          aiTool: payload.aiTool,
          usagePurpose: payload.usagePurpose,
          promptContent: payload.promptContent,
          aiResponseSummary: payload.aiResponseSummary,
          studentDecision: payload.studentDecision,
          reflectionText: payload.reflectionText,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async deleteAiInteraction(id: string, studentId: string) {
    const interactionOid = toObjectId(id, 'AI Interaction')
    const studentOid = toObjectId(studentId, 'Student')

    const interaction = await databaseService.aiInteractions.findOne({
      _id: interactionOid,
      studentId: studentOid
    })

    if (!interaction) {
      throw new ErrorWithStatus({
        message: 'AI Interaction not found or not owned by student',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const submission = await databaseService.submissions.findOne({ _id: interaction.submissionId })
    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (submission.status !== 'draft') {
      throw new ErrorWithStatus({
        message: 'Cannot delete AI interaction of a finalized submission',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.aiInteractions.deleteOne({ _id: interactionOid })

    // Decrement count
    await databaseService.submissions.updateOne(
      { _id: submission._id },
      {
        $inc: { aiInteractionCount: -1 },
        $set: { updatedAt: new Date() }
      }
    )

    return { message: 'Delete AI interaction successfully' }
  }

  async validateRequirements(submissionId: string, studentId: string) {
    const submissionOid = toObjectId(submissionId, 'Submission')
    const studentOid = toObjectId(studentId, 'Student')

    const submission = await databaseService.submissions.findOne({
      _id: submissionOid,
      studentId: studentOid
    })

    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const gradeItem = await databaseService.gradeItems.findOne({ _id: submission.gradeItemId })
    if (!gradeItem) {
      throw new ErrorWithStatus({
        message: 'Grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const count = await databaseService.aiInteractions.countDocuments({ submissionId: submissionOid })

    const declarationRequired = gradeItem.aiInteractionRequired ?? true
    const minInteractions = gradeItem.minAiInteractions ?? 5
    const maxInteractions = gradeItem.maxAiInteractions ?? 10

    let isValid = true
    if (declarationRequired) {
      if (count < minInteractions || count > maxInteractions) {
        isValid = false
      }
    }

    return {
      isValid,
      count,
      required: declarationRequired,
      minAiInteractions: minInteractions,
      maxAiInteractions: maxInteractions
    }
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
      message: 'You do not have permission to access declarations for this submission',
      status: HTTP_STATUS.FORBIDDEN
    })
  }
}

const aiDeclarationService = new AiDeclarationService()
export default aiDeclarationService
