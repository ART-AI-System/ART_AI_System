import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Grade, { GradeType } from '~/models/schemas/grades.schema'
import FinalResult from '~/models/schemas/finalResults.schema'

class GradesService {
  async gradeSubmission(submissionId: string, payload: Omit<GradeType, 'submissionId'>) {
    const existingGrade = await databaseService.grades.findOne({ submissionId: new ObjectId(submissionId) })
    
    if (existingGrade) {
      const result = await databaseService.grades.findOneAndUpdate(
        { submissionId: new ObjectId(submissionId) },
        {
          $set: {
            ...payload,
            studentId: new ObjectId(payload.studentId),
            classId: new ObjectId(payload.classId),
            gradeItemId: new ObjectId(payload.gradeItemId),
            gradedBy: new ObjectId(payload.gradedBy),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )
      return result
    }

    const newGrade = new Grade({
      ...payload,
      submissionId: new ObjectId(submissionId),
      studentId: new ObjectId(payload.studentId),
      classId: new ObjectId(payload.classId),
      gradeItemId: new ObjectId(payload.gradeItemId),
      gradedBy: new ObjectId(payload.gradedBy)
    })
    const result = await databaseService.grades.insertOne(newGrade)
    return { ...newGrade, _id: result.insertedId }
  }

  async getGradeBySubmission(submissionId: string) {
    return await databaseService.grades.findOne({ submissionId: new ObjectId(submissionId) })
  }

  async deleteGradeBySubmission(submissionId: string) {
    return await databaseService.grades.findOneAndDelete({ submissionId: new ObjectId(submissionId) })
  }

  async getGradesByGradeItem(gradeItemId: string) {
    return await databaseService.grades.find({ gradeItemId: new ObjectId(gradeItemId) }).toArray()
  }

  async getGradesByClass(classId: string) {
    return await databaseService.grades.find({ classId: new ObjectId(classId) }).toArray()
  }

  async calculateFinalResult(studentId: string, classId: string) {
    // 1. Get all grade items for the class to know their weights
    const gradeItems = await databaseService.gradeItems.find({ classId: new ObjectId(classId) }).toArray()
    
    // 2. Get all grades for this student in this class
    const grades = await databaseService.grades.find({ 
      classId: new ObjectId(classId),
      studentId: new ObjectId(studentId)
    }).toArray()

    let totalScore = 0

    gradeItems.forEach(item => {
      const studentGrade = grades.find(g => g.gradeItemId.toString() === item._id?.toString())
      if (studentGrade) {
        // Calculate weighted score: (score / maxScore) * 10 * (weight / 100)
        const itemScore = (studentGrade.score / studentGrade.maxScore) * 10 * (item.weight / 100)
        totalScore += itemScore
      }
    })

    // Determine classification
    let classification: 'poor' | 'average' | 'good' | 'very_good' | 'excellent' = 'poor'
    if (totalScore >= 9.0) classification = 'excellent'
    else if (totalScore >= 8.0) classification = 'very_good'
    else if (totalScore >= 6.5) classification = 'good'
    else if (totalScore >= 5.0) classification = 'average'

    // Save or update final result
    const finalResultPayload = {
      studentId: new ObjectId(studentId),
      classId: new ObjectId(classId),
      finalScore: Number(totalScore.toFixed(2)),
      classification,
      calculatedAt: new Date()
    }

    const existingResult = await databaseService.finalResults.findOne({ 
      studentId: new ObjectId(studentId),
      classId: new ObjectId(classId)
    })

    if (existingResult) {
      return await databaseService.finalResults.findOneAndUpdate(
        { _id: existingResult._id },
        { $set: finalResultPayload },
        { returnDocument: 'after' }
      )
    }

    const newFinalResult = new FinalResult(finalResultPayload)
    const result = await databaseService.finalResults.insertOne(newFinalResult)
    return { ...newFinalResult, _id: result.insertedId }
  }
}

const gradesService = new GradesService()
export default gradesService
