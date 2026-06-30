import { ObjectId } from 'mongodb'

export type FlagType =
  | 'low_quality_prompt'
  | 'high_ai_dependency'
  | 'weak_reflection'
  | 'all_responses_accepted'
  | 'missing_ai_interactions'
  | 'suspicious_declaration'
  | 'manual'

export type FlaggedByType = 'system' | 'lecturer' | 'subject_head'
export type SuspectLevelType = 'low' | 'medium' | 'high'
export type FlagStatusType = 'open' | 'reviewed' | 'resolved' | 'dismissed'

export interface SubmissionFlagType {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId // maps to assignmentId
  studentId: ObjectId
  classId: ObjectId
  flagType: FlagType
  description?: string
  flaggedBy: FlaggedByType
  flaggedByUserId?: ObjectId | null
  suspectLevel?: SuspectLevelType
  status?: FlagStatusType
  resolvedBy?: ObjectId | null
  resolvedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export default class SubmissionFlag {
  _id?: ObjectId
  submissionId: ObjectId
  gradeItemId: ObjectId
  studentId: ObjectId
  classId: ObjectId
  flagType: FlagType
  description: string
  flaggedBy: FlaggedByType
  flaggedByUserId: ObjectId | null
  suspectLevel: SuspectLevelType
  status: FlagStatusType
  resolvedBy: ObjectId | null
  resolvedAt: Date | null
  createdAt: Date
  updatedAt: Date

  constructor(flag: SubmissionFlagType) {
    const date = new Date()
    this._id = flag._id || new ObjectId()
    this.submissionId = flag.submissionId
    this.gradeItemId = flag.gradeItemId
    this.studentId = flag.studentId
    this.classId = flag.classId
    this.flagType = flag.flagType
    this.description = flag.description ?? ''
    this.flaggedBy = flag.flaggedBy
    this.flaggedByUserId = flag.flaggedByUserId ?? null
    this.suspectLevel = flag.suspectLevel ?? 'low'
    this.status = flag.status ?? 'open'
    this.resolvedBy = flag.resolvedBy ?? null
    this.resolvedAt = flag.resolvedAt ?? null
    this.createdAt = flag.createdAt || date
    this.updatedAt = flag.updatedAt || date
  }
}
