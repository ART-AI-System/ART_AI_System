import { ObjectId } from 'mongodb'

export type AiToolType = 'chatgpt' | 'gemini' | 'claude' | 'copilot' | 'other'

export type UsagePurposeType =
  | 'decomposition'
  | 'pattern_recognition'
  | 'abstraction'
  | 'algorithmic_thinking'
  | 'reflection'

export type StudentDecisionType = 'accepted' | 'partially_accepted' | 'rejected' | 'reference_only'

export interface AiInteractionType {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId
  studentId: ObjectId
  aiTool: AiToolType
  usagePurpose: UsagePurposeType
  promptContent: string
  aiResponseSummary: string
  studentDecision: StudentDecisionType
  reflectionText: string
  isValidForSubmission?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class AiInteraction {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId
  studentId: ObjectId
  aiTool: AiToolType
  usagePurpose: UsagePurposeType
  promptContent: string
  aiResponseSummary: string
  studentDecision: StudentDecisionType
  reflectionText: string
  isValidForSubmission: boolean
  createdAt: Date
  updatedAt: Date

  constructor(interaction: AiInteractionType) {
    const date = new Date()
    this._id = interaction._id || new ObjectId()
    this.submissionId = interaction.submissionId
    this.gradeItemId = interaction.gradeItemId
    this.studentId = interaction.studentId
    this.aiTool = interaction.aiTool
    this.usagePurpose = interaction.usagePurpose
    this.promptContent = interaction.promptContent
    this.aiResponseSummary = interaction.aiResponseSummary
    this.studentDecision = interaction.studentDecision
    this.reflectionText = interaction.reflectionText
    this.isValidForSubmission = interaction.isValidForSubmission ?? true
    this.createdAt = interaction.createdAt || date
    this.updatedAt = interaction.updatedAt || date
  }
}
