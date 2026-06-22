import { ObjectId } from 'mongodb'

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX'
}

export interface OptionSchema {
  _id: ObjectId
  text: string
  isCorrect: boolean
}

export interface QuestionSchema {
  _id: ObjectId
  type: QuestionType
  text: string
  points: number
  options: OptionSchema[]
}

export interface Test {
  _id?: ObjectId
  classId: ObjectId
  title: string
  duration: number // in minutes
  totalPoints: number
  showResultImmediately: boolean // true if student can see answers right after submit
  questions: QuestionSchema[]
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
