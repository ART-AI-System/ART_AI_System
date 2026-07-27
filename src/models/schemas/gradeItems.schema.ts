import { ObjectId } from 'mongodb'

export interface RubricCriterion {
  id: string
  name: string
  description: string
  maxPoints: number
  evidenceRequirements?: string[]
}

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
  aiDeclarationConfig?: { categoryId: string, weight: number }[]
  rubric?: RubricCriterion[]
  sequenceOrder?: number
  isActive?: boolean
  isGroupAssignment?: boolean
  
  // Test fields
  type?: string
  duration?: number
  totalPoints?: number
  showResultImmediately?: boolean
  questions?: any[]
  isRandomPerStudent?: boolean
  randomCount?: number

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
  aiDeclarationConfig: { categoryId: string, weight: number }[]
  rubric: RubricCriterion[]
  sequenceOrder: number
  isActive: boolean
  isGroupAssignment: boolean
  
  // Test fields
  type?: string
  duration?: number
  totalPoints?: number
  showResultImmediately?: boolean
  questions?: any[]
  isRandomPerStudent?: boolean
  randomCount?: number

  createdAt: Date
  updatedAt: Date

  constructor(gradeItemData: GradeItemType) {
    const date = new Date()
    this._id = gradeItemData._id || new ObjectId()
    this.classId = gradeItemData.classId
    this.sessionId = gradeItemData.sessionId
    this.title = gradeItemData.title
    this.description = gradeItemData.description || ''
    this.weight = gradeItemData.weight || 0
    this.maxScore = gradeItemData.maxScore || 10
    this.deadline = gradeItemData.deadline || new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
    this.aiInteractionRequired = gradeItemData.aiInteractionRequired ?? false
    this.minAiInteractions = gradeItemData.minAiInteractions || 0
    this.maxAiInteractions = gradeItemData.maxAiInteractions || 0
    this.aiDeclarationConfig = gradeItemData.aiDeclarationConfig || []
    this.rubric = gradeItemData.rubric || []
    this.sequenceOrder = gradeItemData.sequenceOrder || 1
    this.isActive = gradeItemData.isActive ?? true
    this.isGroupAssignment = gradeItemData.isGroupAssignment ?? false
    
    // Test fields
    this.type = gradeItemData.type || 'assignment'
    this.duration = gradeItemData.duration
    this.totalPoints = gradeItemData.totalPoints
    this.showResultImmediately = gradeItemData.showResultImmediately
    this.questions = gradeItemData.questions
    this.isRandomPerStudent = gradeItemData.isRandomPerStudent
    this.randomCount = gradeItemData.randomCount

    this.createdAt = gradeItemData.createdAt || date
    this.updatedAt = gradeItemData.updatedAt || date
  }
}
