import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import gradesService from './grades.service'
import reportService from './report.services'

class FinalResultService {
  /**
   * Tính toán điểm tổng kết cho tất cả sinh viên trong một lớp.
   * Lấy danh sách học sinh từ Class document, sau đó gọi gradesService.calculateFinalResult cho từng sinh viên.
   */
  async calculateClassFinalResults(classId: string) {
    const classOid = new ObjectId(classId)
    const classDoc = await databaseService.classes.findOne({ _id: classOid })
    
    if (!classDoc) {
      throw new Error('Class not found')
    }

    const students = classDoc.students || []
    if (students.length === 0) {
      return []
    }

    // Kiểm tra tổng trọng số các cột điểm của lớp có bằng 100% hay không
    const gradeItems = await databaseService.gradeItems.find({ classId: classOid, isActive: true }).toArray()
    const totalWeight = gradeItems.reduce((sum, item) => sum + item.weight, 0)
    if (totalWeight !== 100) {
      throw new Error('Tổng trọng số của các cột điểm trong lớp phải bằng 100% để tính điểm tổng kết')
    }

    const results = []
    for (const student of students) {
      const result = await gradesService.calculateFinalResult(student.studentId.toString(), classId)
      results.push(result)
    }

    return results
  }

  /**
   * Lấy danh sách điểm tổng kết kèm thông tin chi tiết sinh viên của một lớp.
   */
  async getFinalResultsByClass(classId: string) {
    return await reportService.getFinalResults(classId)
  }

  /**
   * Lấy điểm tổng kết của một sinh viên cụ thể trong một lớp.
   */
  async getStudentFinalResultInClass(studentId: string, classId: string) {
    const studentOid = new ObjectId(studentId)
    const classOid = new ObjectId(classId)

    const finalResult = await databaseService.finalResults.findOne({
      studentId: studentOid,
      classId: classOid
    })

    if (!finalResult) {
      return null
    }

    // Enrich với thông tin sinh viên và lớp học
    const classDoc = await databaseService.classes.findOne({ _id: classOid })
    const studentSnapshot = classDoc?.students?.find(
      (s: any) => s.studentId.toString() === studentId
    )

    return {
      ...finalResult,
      studentCode: studentSnapshot?.studentCode || '',
      fullName: studentSnapshot?.fullName || '',
      email: studentSnapshot?.email || '',
      classCode: classDoc?.classCode || '',
      subjectName: classDoc?.subjectName || '',
      semester: classDoc?.semester || ''
    }
  }

  /**
   * Lấy tất cả kết quả học tập của học sinh hiện tại đăng nhập.
   */
  async getMyFinalResults(studentId: string) {
    const studentOid = new ObjectId(studentId)

    const results = await databaseService.finalResults
      .aggregate([
        { $match: { studentId: studentOid } },
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION || 'classes',
            localField: 'classId',
            foreignField: '_id',
            as: 'classInfo'
          }
        },
        { $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            studentId: 1,
            classId: 1,
            finalScore: 1,
            classification: 1,
            calculatedAt: 1,
            classCode: '$classInfo.classCode',
            subjectName: '$classInfo.subjectName',
            semester: '$classInfo.semester',
            academicYear: '$classInfo.academicYear'
          }
        },
        { $sort: { calculatedAt: -1 } }
      ])
      .toArray()

    return results
  }

  /**
   * Lấy thống kê xếp loại học sinh trong lớp.
   */
  async getClassifications(classId: string) {
    return await reportService.getClassifications(classId)
  }

  /**
   * Lấy bảng xếp hạng sinh viên trong lớp.
   */
  async getRankings(classId: string) {
    return await reportService.getRankings(classId)
  }

  /**
   * Lấy thông tin xếp loại của một sinh viên cụ thể.
   * Nếu có classId thì lấy xếp loại của lớp đó, ngược lại lấy tất cả các lớp của sinh viên.
   */
  async getStudentClassification(studentId: string, classId?: string) {
    const studentOid = new ObjectId(studentId)
    
    if (classId) {
      const result = await databaseService.finalResults.findOne({
        studentId: studentOid,
        classId: new ObjectId(classId)
      })
      if (!result) return null
      return {
        classId: result.classId,
        finalScore: result.finalScore,
        classification: result.classification,
        calculatedAt: result.calculatedAt
      }
    }

    const results = await databaseService.finalResults
      .aggregate([
        { $match: { studentId: studentOid } },
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION || 'classes',
            localField: 'classId',
            foreignField: '_id',
            as: 'classInfo'
          }
        },
        { $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            classId: 1,
            classCode: '$classInfo.classCode',
            subjectName: '$classInfo.subjectName',
            finalScore: 1,
            classification: 1,
            calculatedAt: 1
          }
        }
      ])
      .toArray()

    return results
  }
}

const finalResultService = new FinalResultService()
export default finalResultService
