import { ObjectId } from 'mongodb'

export interface GradeItemType {
  _id?: ObjectId
  classId: ObjectId
  sessionId?: ObjectId
  title: string
  description?: string
  weight: number
  maxScore?: number
  deadline: Date
  aiInteractionRequired?: boolean
  minAiInteractions?: number
  maxAiInteractions?: number
  sequenceOrder?: number
  isActive?: boolean
  isGroupAssignment?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class GradeItem {
  _id?: ObjectId
  classId: ObjectId
  sessionId?: ObjectId
  title: string
  description: string
  weight: number
  maxScore: number
  deadline: Date
  aiInteractionRequired: boolean
  minAiInteractions: number
  maxAiInteractions: number
  sequenceOrder: number
  isActive: boolean
  isGroupAssignment: boolean
  createdAt: Date
  updatedAt: Date

  constructor(gradeItemData: GradeItemType) {
    const date = new Date()
    this._id = gradeItemData._id
    this.classId = gradeItemData.classId
    this.sessionId = gradeItemData.sessionId
    this.title = gradeItemData.title
    this.description = gradeItemData.description || ''
    this.weight = gradeItemData.weight
    this.maxScore = gradeItemData.maxScore || 10
    this.deadline = gradeItemData.deadline
    this.aiInteractionRequired = gradeItemData.aiInteractionRequired ?? false
    this.minAiInteractions = gradeItemData.minAiInteractions || 0
    this.maxAiInteractions = gradeItemData.maxAiInteractions || 0
    this.sequenceOrder = gradeItemData.sequenceOrder || 1
    this.isActive = gradeItemData.isActive ?? true
    this.isGroupAssignment = gradeItemData.isGroupAssignment ?? false
    this.createdAt = gradeItemData.createdAt || date
    this.updatedAt = gradeItemData.updatedAt || date
  }
}
