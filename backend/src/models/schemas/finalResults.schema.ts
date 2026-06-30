import { ObjectId } from 'mongodb'

export interface FinalResultType {
  _id?: ObjectId
  studentId: ObjectId
  classId: ObjectId
  finalScore: number
  classification: 'poor' | 'average' | 'good' | 'very_good' | 'excellent'
  calculatedAt?: Date
}

export default class FinalResult {
  _id?: ObjectId
  studentId: ObjectId
  classId: ObjectId
  finalScore: number
  classification: 'poor' | 'average' | 'good' | 'very_good' | 'excellent'
  calculatedAt: Date

  constructor(finalResult: FinalResultType) {
    this._id = finalResult._id || new ObjectId()
    this.studentId = finalResult.studentId
    this.classId = finalResult.classId
    this.finalScore = finalResult.finalScore
    this.classification = finalResult.classification
    this.calculatedAt = finalResult.calculatedAt || new Date()
  }
}
