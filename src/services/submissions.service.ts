import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedSubmissionFile } from '~/models/requests/submissions.request'
import Submission from '~/models/schemas/submissions.schema'
import User from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'

const SUBMISSION_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'submissions')
const HEATMAP_VALID_STATUSES = ['submitted', 'late', 'evaluated', 'reviewed', 'graded', 'flagged']

type SubmissionHeatmapQuery = {
  startDate?: string
  endDate?: string
  semesterId?: string
}

function toObjectId(id: string, entityName: string) {
  if (!ObjectId.isValid(id)) {
    throw new ErrorWithStatus({
      message: `${entityName} id is invalid`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  return new ObjectId(id)
}

function ensureSubmissionUploadDir() {
  if (!fs.existsSync(SUBMISSION_UPLOAD_DIR)) {
    fs.mkdirSync(SUBMISSION_UPLOAD_DIR, { recursive: true })
  }
}

function removeFileIfExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, () => {})
  }
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseDateOnly(value: string, fieldName: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ErrorWithStatus({
      message: `${fieldName} must use YYYY-MM-DD format`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime()) || formatDateKey(date) !== value) {
    throw new ErrorWithStatus({
      message: `${fieldName} is invalid`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  return date
}

function addUtcDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

class SubmissionsService {
  async createSubmission(gradeItemId: string, studentId: string, file: UploadedSubmissionFile, note = '') {
    const gradeItemObjectId = toObjectId(gradeItemId, 'Grade item')
    const studentObjectId = toObjectId(studentId, 'Student')

    const gradeItem = await databaseService.gradeItems.findOne({
      _id: gradeItemObjectId,
      isActive: { $ne: false }
    })

    if (!gradeItem) {
      removeFileIfExists(file.filepath)
      throw new ErrorWithStatus({
        message: 'Grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const classData = await databaseService.classes.findOne({
      _id: gradeItem.classId,
      'students.studentId': studentObjectId,
      isActive: { $ne: false }
    })

    if (!classData) {
      removeFileIfExists(file.filepath)
      throw new ErrorWithStatus({
        message: 'Student is not enrolled in this class',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const latestSubmission = await databaseService.submissions.findOne(
      {
        gradeItemId: gradeItemObjectId,
        studentId: studentObjectId
      },
      {
        sort: {
          versionNumber: -1
        }
      }
    )

    const versionNumber = latestSubmission ? latestSubmission.versionNumber + 1 : 1
    const uuid = randomUUID()
    const ext = path.extname(file.originalFilename).toLowerCase()
    const storageFileName = `${uuid}${ext}`
    const fileStorageKey = path.join('uploads', 'submissions', storageFileName)
    const finalFilePath = path.join(process.cwd(), fileStorageKey)

    ensureSubmissionUploadDir()
    fs.renameSync(file.filepath, finalFilePath)

    await databaseService.submissions.updateMany(
      {
        gradeItemId: gradeItemObjectId,
        studentId: studentObjectId,
        isLatest: true
      },
      {
        $set: {
          isLatest: false,
          updatedAt: new Date()
        }
      }
    )

    const newSubmission = new Submission({
      uuid,
      gradeItemId: gradeItemObjectId,
      classId: gradeItem.classId,
      studentId: studentObjectId,
      versionNumber,
      fileName: file.originalFilename,
      fileStorageKey,
      fileSize: file.size,
      mimeType: file.mimetype,
      contentHash: file.contentHash,
      note
    })

    const result = await databaseService.submissions.insertOne(newSubmission)
    return { ...newSubmission, _id: result.insertedId }
  }

  async getMySubmissionByGradeItem(gradeItemId: string, studentId: string) {
    return await databaseService.submissions.findOne(
      {
        gradeItemId: toObjectId(gradeItemId, 'Grade item'),
        studentId: toObjectId(studentId, 'Student'),
        isLatest: true
      },
      {
        sort: {
          submittedAt: -1
        }
      }
    )
  }

  async getSubmissionsByGradeItem(gradeItemId: string, user: User) {
    const gradeItemObjectId = toObjectId(gradeItemId, 'Grade item')
    const userObjectId = user._id as ObjectId
    const gradeItem = await databaseService.gradeItems.findOne({ _id: gradeItemObjectId })

    if (!gradeItem) {
      throw new ErrorWithStatus({
        message: 'Grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const classData =
      user.role === 'SUBJECT_HEAD' || user.role === 'ADMIN'
        ? await databaseService.classes.findOne({ _id: gradeItem.classId })
        : await databaseService.classes.findOne({
            _id: gradeItem.classId,
            'lecturer.lecturerId': userObjectId
          })

    if (!classData) {
      throw new ErrorWithStatus({
        message: 'You do not have permission to view submissions for this grade item',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    return await databaseService.submissions
      .find({
        gradeItemId: gradeItemObjectId,
        isLatest: true,
        status: { $ne: 'draft' } // Exclude draft submissions from lecturer views
      })
      .sort({ submittedAt: -1 })
      .toArray()
  }

  async getSubmissionHistoryByGradeItem(gradeItemId: string, user: User) {
    const gradeItemObjectId = toObjectId(gradeItemId, 'Grade item')
    const userObjectId = user._id as ObjectId
    const gradeItem = await databaseService.gradeItems.findOne({ _id: gradeItemObjectId })

    if (!gradeItem) {
      throw new ErrorWithStatus({
        message: 'Grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const filter: Record<string, any> = {
      gradeItemId: gradeItemObjectId
    }

    if (user.role === 'STUDENT') {
      const enrollment = await databaseService.classMembers.findOne({
        classId: gradeItem.classId,
        studentId: userObjectId,
        status: { $ne: 'dropped' }
      })

      const classData = await databaseService.classes.findOne({
        _id: gradeItem.classId,
        'students.studentId': userObjectId,
        isActive: { $ne: false }
      })

      if (!enrollment && !classData) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to view submission history for this assignment',
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      filter.studentId = userObjectId
    } else {
      const classData =
        user.role === 'SUBJECT_HEAD' || user.role === 'ADMIN'
          ? await databaseService.classes.findOne({ _id: gradeItem.classId })
          : await databaseService.classes.findOne({
              _id: gradeItem.classId,
              isActive: { $ne: false },
              $or: [{ 'lecturer.lecturerId': userObjectId }, { lecturerId: userObjectId }]
            })

      if (!classData) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to view submission history for this assignment',
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      filter.status = { $ne: 'draft' }
    }

    const submissions = await databaseService.submissions.find(filter).sort({ submittedAt: -1 }).toArray()

    return {
      assignmentId: gradeItemId,
      totalSubmissions: submissions.length,
      submissions: submissions.map((submission) => ({
        submissionId: submission._id,
        studentId: submission.studentId,
        classId: submission.classId,
        version: submission.versionNumber,
        submittedAt: submission.submittedAt,
        finalizedAt: submission.finalizedAt,
        status: submission.status,
        isLatest: submission.isLatest,
        fileName: submission.fileName,
        fileSize: submission.fileSize,
        mimeType: submission.mimeType,
        note: submission.note
      }))
    }
  }

  async getSubmissionById(id: string, user: User) {
    const submission = await databaseService.submissions.findOne({ _id: toObjectId(id, 'Submission') })

    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await this.assertCanViewSubmission(submission, user)
    return submission
  }

  async getMySubmissions(studentId: string) {
    return await databaseService.submissions
      .find({
        studentId: toObjectId(studentId, 'Student'),
        isLatest: true
      })
      .sort({ submittedAt: -1 })
      .toArray()
  }

  async getSubmissionHeatmap(studentId: string, user: User, query: SubmissionHeatmapQuery = {}) {
    const studentObjectId = toObjectId(studentId, 'Student')
    await this.assertCanViewStudentHeatmap(studentObjectId, user)

    const now = new Date()
    const currentYear = now.getFullYear()
    const startDate = parseDateOnly(query.startDate || `${currentYear}-01-01`, 'startDate')
    const endDate = parseDateOnly(query.endDate || `${currentYear}-12-31`, 'endDate')

    if (startDate > endDate) {
      throw new ErrorWithStatus({
        message: 'startDate must be before or equal to endDate',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const endExclusive = addUtcDays(endDate, 1)
    const filter: Record<string, any> = {
      studentId: studentObjectId,
      status: { $in: HEATMAP_VALID_STATUSES },
      $or: [
        { submittedAt: { $gte: startDate, $lt: endExclusive } },
        {
          submittedAt: { $exists: false },
          finalizedAt: { $gte: startDate, $lt: endExclusive }
        },
        {
          submittedAt: null,
          finalizedAt: { $gte: startDate, $lt: endExclusive }
        }
      ]
    }

    if (query.semesterId) {
      const semesterObjectId = toObjectId(query.semesterId, 'Semester')
      const semesterClasses = await databaseService.classes
        .find({
          semesterId: semesterObjectId,
          isActive: { $ne: false }
        })
        .project({ _id: 1 })
        .toArray()
      filter.classId = { $in: semesterClasses.map((classData) => classData._id) }
    }

    const submissions = await databaseService.submissions.find(filter).toArray()
    const countByDate = new Map<string, number>()

    for (const submission of submissions) {
      const activityDate = submission.submittedAt || submission.finalizedAt
      if (!activityDate) continue

      const dateKey = formatDateKey(new Date(activityDate))
      countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + 1)
    }

    const days = []
    for (let date = new Date(startDate); date <= endDate; date = addUtcDays(date, 1)) {
      const dateKey = formatDateKey(date)
      days.push({
        date: dateKey,
        count: countByDate.get(dateKey) || 0
      })
    }

    return {
      studentId,
      startDate: formatDateKey(startDate),
      endDate: formatDateKey(endDate),
      totalSubmissions: submissions.length,
      days
    }
  }

  async getSubmissionVersions(submissionId: string, user: User) {
    const submission = await this.getSubmissionById(submissionId, user)

    return await databaseService.submissions
      .find({
        gradeItemId: submission.gradeItemId,
        studentId: submission.studentId
      })
      .sort({ versionNumber: -1 })
      .toArray()
  }

  async getSubmissionVersionById(versionId: string, user: User) {
    return await this.getSubmissionById(versionId, user)
  }

  getSubmissionFilePath(submission: Pick<Submission, 'fileStorageKey'>) {
    return path.join(process.cwd(), submission.fileStorageKey)
  }

  async finalizeSubmission(id: string, studentId: string) {
    const submissionObjectId = toObjectId(id, 'Submission')
    const studentObjectId = toObjectId(studentId, 'Student')

    const submission = await databaseService.submissions.findOne({
      _id: submissionObjectId,
      studentId: studentObjectId
    })

    if (!submission) {
      throw new ErrorWithStatus({
        message: 'Submission not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (submission.status !== 'draft') {
      throw new ErrorWithStatus({
        message: 'Submission is already finalized',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const filePath = this.getSubmissionFilePath(submission)
    if (!fs.existsSync(filePath)) {
      throw new ErrorWithStatus({
        message: 'Submission file does not exist on disk',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const gradeItem = await databaseService.gradeItems.findOne({
      _id: submission.gradeItemId
    })

    if (!gradeItem) {
      throw new ErrorWithStatus({
        message: 'Associated grade item not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const interactionCount = await databaseService.aiInteractions.countDocuments({
      submissionId: submissionObjectId
    })

    const declarationRequired = gradeItem.aiInteractionRequired ?? true
    const minInteractions = gradeItem.minAiInteractions ?? 5
    const maxInteractions = gradeItem.maxAiInteractions ?? 10

    // Bỏ qua validate số lượng tối thiểu/tối đa theo yêu cầu
    
    const now = new Date()
    const deadline = new Date(gradeItem.deadline)
    const status = now <= deadline ? 'submitted' : 'late'

    const result = await databaseService.submissions.findOneAndUpdate(
      { _id: submissionObjectId },
      {
        $set: {
          status,
          finalizedAt: now,
          aiRequirementSatisfied: true,
          aiInteractionCount: interactionCount,
          updatedAt: now
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async resubmitSubmissionVersion(submissionId: string, studentId: string, file: UploadedSubmissionFile, note = '') {
    const currentSubmission = await this.getSubmissionById(submissionId, {
      _id: toObjectId(studentId, 'Student'),
      role: 'STUDENT'
    } as User)

    if (currentSubmission.status === 'draft') {
      removeFileIfExists(this.getSubmissionFilePath(currentSubmission))

      const uuid = randomUUID()
      const ext = path.extname(file.originalFilename).toLowerCase()
      const storageFileName = `${uuid}${ext}`
      const fileStorageKey = path.join('uploads', 'submissions', storageFileName)
      const finalFilePath = path.join(process.cwd(), fileStorageKey)

      ensureSubmissionUploadDir()
      fs.renameSync(file.filepath, finalFilePath)

      return await databaseService.submissions.findOneAndUpdate(
        { _id: currentSubmission._id },
        {
          $set: {
            uuid,
            fileName: file.originalFilename,
            fileStorageKey,
            fileSize: file.size,
            mimeType: file.mimetype,
            contentHash: file.contentHash,
            note,
            submittedAt: new Date(),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )
    }

    return await this.createSubmission(currentSubmission.gradeItemId.toString(), studentId, file, note)
  }

  async withdrawSubmission(id: string, user: User) {
    const submission = await this.getSubmissionById(id, user)
    const userId = user._id as ObjectId

    if (user.role === 'STUDENT') {
      if (submission.studentId.toString() !== userId.toString()) {
        throw new ErrorWithStatus({
          message: 'You can only withdraw your own submissions',
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      if (submission.status !== 'draft') {
        throw new ErrorWithStatus({
          message: 'Only draft submissions can be withdrawn by student',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    if (user.role === 'LECTURER') {
      const classData = await databaseService.classes.findOne({
        _id: submission.classId,
        'lecturer.lecturerId': userId
      })

      if (!classData) {
        throw new ErrorWithStatus({
          message: 'You do not have permission to withdraw this submission',
          status: HTTP_STATUS.FORBIDDEN
        })
      }
    }

    if (user.role !== 'STUDENT' && user.role !== 'LECTURER' && user.role !== 'ADMIN') {
      throw new ErrorWithStatus({
        message: 'You do not have permission to withdraw this submission',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const result = await databaseService.submissions.findOneAndUpdate(
      { _id: submission._id },
      {
        $set: {
          status: 'withdrawn',
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  private async assertCanViewStudentHeatmap(studentId: ObjectId, user: User) {
    const userId = user._id as ObjectId

    if (user.role === 'ADMIN' || user.role === 'SUBJECT_HEAD') {
      return
    }

    if (user.role === 'STUDENT' && studentId.toString() === userId.toString()) {
      return
    }

    if (user.role === 'LECTURER') {
      const classMembers = await databaseService.classMembers
        .find({
          studentId,
          status: { $ne: 'dropped' }
        })
        .project({ classId: 1 })
        .toArray()
      const classIds = classMembers.map((classMember) => classMember.classId).filter(Boolean)

      const lecturerClass = await databaseService.classes.findOne({
        isActive: { $ne: false },
        $or: [
          { _id: { $in: classIds }, 'lecturer.lecturerId': userId },
          { _id: { $in: classIds }, lecturerId: userId },
          { 'students.studentId': studentId, 'lecturer.lecturerId': userId },
          { 'students.studentId': studentId, lecturerId: userId }
        ]
      })

      if (lecturerClass) {
        return
      }
    }

    throw new ErrorWithStatus({
      message: 'You do not have permission to view this student submission heatmap',
      status: HTTP_STATUS.FORBIDDEN
    })
  }

  private async assertCanViewSubmission(submission: Submission, user: User) {
    const userId = user._id as ObjectId

    if (submission.status === 'draft' && submission.studentId.toString() !== userId.toString()) {
      throw new ErrorWithStatus({
        message: 'Draft submissions are only visible to the owner student',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (user.role === 'ADMIN' || user.role === 'SUBJECT_HEAD') {
      return
    }

    if (user.role === 'STUDENT' && submission.studentId.toString() === userId.toString()) {
      return
    }

    if (user.role === 'LECTURER') {
      const classData = await databaseService.classes.findOne({
        _id: submission.classId,
        'lecturer.lecturerId': userId
      })

      if (classData) {
        return
      }
    }

    throw new ErrorWithStatus({
      message: 'You do not have permission to view this submission',
      status: HTTP_STATUS.FORBIDDEN
    })
  }
}

const submissionsService = new SubmissionsService()
export default submissionsService
