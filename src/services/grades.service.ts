import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Grade, { GradeType } from '~/models/schemas/grades.schema'
import FinalResult from '~/models/schemas/finalResults.schema'

class GradesService {
  async gradeSubmission(submissionId: string, payload: Omit<GradeType, 'submissionId'>, userId: string) {
    const submission = await databaseService.submissions.findOne({ _id: new ObjectId(submissionId) })
    if (!submission) {
      throw new Error('Submission not found')
    }

    const targetStudentId = payload.studentId ? new ObjectId(payload.studentId) : submission.studentId
    const studentIdsToGrade = [targetStudentId]

    // If grading the representative (target is the submission owner), also grade all group members
    if (targetStudentId.toString() === submission.studentId.toString() && submission.groupMembers && submission.groupMembers.length > 0) {
      studentIdsToGrade.push(...submission.groupMembers)
    }

    const results = []

    for (const sId of studentIdsToGrade) {
      const existingGrade = await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: sId 
      })
      
      if (existingGrade) {
        const result = await databaseService.grades.findOneAndUpdate(
          { _id: existingGrade._id },
          {
            $set: {
              score: payload.score,
              maxScore: payload.maxScore,
              feedback: payload.feedback,
              studentId: sId,
              classId: submission.classId,
              gradeItemId: submission.gradeItemId,
              gradedBy: new ObjectId(userId),
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )
        results.push(result)
      } else {
        const newGrade = new Grade({
          ...payload,
          submissionId: new ObjectId(submissionId),
          studentId: sId,
          classId: submission.classId,
          gradeItemId: submission.gradeItemId,
          gradedBy: new ObjectId(userId)
        })
        const result = await databaseService.grades.insertOne(newGrade)
        results.push({ ...newGrade, _id: result.insertedId })
      }
    }

    // Return the result for the specific target student, or the first one
    return results[0]
  }

  async getGradeBySubmission(submissionId: string, user?: any, targetStudentId?: string) {
    if (user && user.role === 'STUDENT') {
      return await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: user._id
      })
    }
    
    // For Lecturer/Admin, if targetStudentId is provided, return that specific student's grade
    if (targetStudentId) {
      return await databaseService.grades.findOne({ 
        submissionId: new ObjectId(submissionId),
        studentId: new ObjectId(targetStudentId)
      })
    }

    // Otherwise return the grade of the submission owner
    const submission = await databaseService.submissions.findOne({ _id: new ObjectId(submissionId) })
    if (!submission) return null;

    return await databaseService.grades.findOne({ 
      submissionId: new ObjectId(submissionId),
      studentId: submission.studentId
    })
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
