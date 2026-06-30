import { ObjectId } from 'mongodb'

export type AiUsagePatternType = 'critical_engagement' | 'collaborative_usage' | 'passive_usage' | 'high_dependency'
export type RiskLevelType = 'low' | 'medium' | 'high'

export interface AiEvaluationType {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId // maps to assignmentId
  studentId: ObjectId
  classId: ObjectId
  pattern: AiUsagePatternType
  riskLevel?: RiskLevelType
  transparencyScore?: number
  promptQualityScore?: number
  reflectionQualityScore?: number
  criticalThinkingScore?: number
  aiDependencyScore?: number
  summary?: string
  evaluatedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export default class AiEvaluation {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId
  studentId: ObjectId
  classId: ObjectId
  pattern: AiUsagePatternType
  riskLevel: RiskLevelType
  transparencyScore: number
  promptQualityScore: number
  reflectionQualityScore: number
  criticalThinkingScore: number
  aiDependencyScore: number
  summary: string
  evaluatedAt: Date
  createdAt: Date
  updatedAt: Date

  constructor(evaluation: AiEvaluationType) {
    const date = new Date()
    this._id = evaluation._id || new ObjectId()
    this.submissionId = evaluation.submissionId
    this.gradeItemId = evaluation.gradeItemId
    this.studentId = evaluation.studentId
    this.classId = evaluation.classId
    this.pattern = evaluation.pattern
    this.riskLevel = evaluation.riskLevel ?? 'low'
    this.transparencyScore = evaluation.transparencyScore ?? 0
    this.promptQualityScore = evaluation.promptQualityScore ?? 0
    this.reflectionQualityScore = evaluation.reflectionQualityScore ?? 0
    this.criticalThinkingScore = evaluation.criticalThinkingScore ?? 0
    this.aiDependencyScore = evaluation.aiDependencyScore ?? 0
    this.summary = evaluation.summary ?? ''
    this.evaluatedAt = evaluation.evaluatedAt || date
    this.createdAt = evaluation.createdAt || date
    this.updatedAt = evaluation.updatedAt || date
  }
}
