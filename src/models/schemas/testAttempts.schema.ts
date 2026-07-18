import { ObjectId } from 'mongodb'

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  TIMEOUT = 'TIMEOUT'
}

export interface AnswerSchema {
  questionId: ObjectId
  selectedOptionIds: string[] // Array of option _id strings chosen by the student
}

export interface TestAttempt {
  _id?: ObjectId
  testId: ObjectId
  studentId: ObjectId
  classId: ObjectId
  startTime: Date
  submitTime: Date | null
  score: number | null // the auto-graded score out of Test.totalPoints
  cheatIncidents: number // number of times visibility was lost / tab switched
  status: AttemptStatus
  answers: AnswerSchema[]
  createdAt?: Date
  updatedAt?: Date
}
