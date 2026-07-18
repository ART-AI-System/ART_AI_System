import { ObjectId } from 'mongodb'

export type AssignmentStatus = 'draft' | 'published' | 'closed'

export interface AssignmentType {
  _id?: ObjectId
  sessionId: ObjectId
  classId: ObjectId
  title: string
  description?: string
  instructions?: string
  deadline: Date
  maxScore?: number
  weight?: number
  aiDeclarationRequired?: boolean
  minAiInteractions?: number
  maxAiInteractions?: number
  allowResubmission?: boolean
  status?: AssignmentStatus
  isPublished?: boolean
  isGroupAssignment?: boolean
  publishedAt?: Date | null
  closedAt?: Date | null
  createdBy: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export default class Assignment {
  _id?: ObjectId
  sessionId: ObjectId
  classId: ObjectId
  title: string
  description: string
  instructions: string
  deadline: Date
  maxScore: number
  weight: number
  aiDeclarationRequired: boolean
  minAiInteractions: number
  maxAiInteractions: number
  allowResubmission: boolean
  status: AssignmentStatus
  isPublished: boolean
  isGroupAssignment: boolean
  publishedAt: Date | null
  closedAt: Date | null
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date

  constructor(data: AssignmentType) {
    const date = new Date()
    this._id = data._id
    this.sessionId = data.sessionId
    this.classId = data.classId
    this.title = data.title
    this.description = data.description || ''
    this.instructions = data.instructions || ''
    this.deadline = data.deadline
    this.maxScore = data.maxScore ?? 10
    this.weight = data.weight ?? 0
    this.aiDeclarationRequired = data.aiDeclarationRequired ?? true
    this.minAiInteractions = data.minAiInteractions ?? 5
    this.maxAiInteractions = data.maxAiInteractions ?? 10
    this.allowResubmission = data.allowResubmission ?? true
    this.status = data.status || 'draft'
    this.isPublished = data.isPublished ?? false
    this.isGroupAssignment = data.isGroupAssignment ?? false
    this.publishedAt = data.publishedAt ?? null
    this.closedAt = data.closedAt ?? null
    this.createdBy = data.createdBy
    this.createdAt = data.createdAt || date
    this.updatedAt = data.updatedAt || date
  }
}
