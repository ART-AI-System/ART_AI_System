import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { crc32 } from 'zlib'
import AdmZip from 'adm-zip'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedSubmissionFile } from '~/models/requests/submissions.request'
import Submission from '~/models/schemas/submissions.schema'
import User from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'

const SUBMISSION_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'submissions')
const HEATMAP_VALID_STATUSES = ['submitted', 'late', 'evaluated', 'reviewed', 'graded', 'flagged']
const MAX_TEXT_PREVIEW_SIZE = 1024 * 1024
const TEXT_FILE_EXTENSIONS = new Set([
  '.txt', '.md', '.json', '.xml', '.html', '.htm', '.css', '.js', '.jsx', '.ts', '.tsx',
  '.java', '.cs', '.cpp', '.c', '.h', '.py', '.php', '.rb', '.go', '.rs', '.sql',
  '.yaml', '.yml', '.csv', '.env', '.gitignore',
  '.properties', '.gradle', '.bat', '.sh', '.ini', '.toml', '.lock', '.log', '.conf'
])

type SubmissionHeatmapQuery = {
  startDate?: string
  endDate?: string
  semesterId?: string
}

type SubmissionFileContentQuery = {
  path?: string
}

type SubmissionTreeNode = {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  mimeType?: string
  children?: SubmissionTreeNode[]
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

function sanitizeZipEntryPath(entryPath: string) {
  return entryPath
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..')
    .join('/')
}

function sortTreeNodes(nodes: SubmissionTreeNode[]) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  for (const node of nodes) {
    if (node.children) {
      sortTreeNodes(node.children)
    }
  }
}

function addPathToTree(root: SubmissionTreeNode, entryPath: string, size: number, isDirectory: boolean) {
  const safePath = sanitizeZipEntryPath(entryPath)
  if (!safePath || safePath.startsWith('__MACOSX/')) return

  const parts = safePath.split('/')
  let current = root
  let currentPath = ''

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]
    const isLast = index === parts.length - 1
    currentPath = currentPath ? `${currentPath}/${part}` : part

    if (!current.children) current.children = []

    let existing = current.children.find((child) => child.name === part)
    if (!existing) {
      existing = {
        name: part,
        path: currentPath,
        type: isLast && !isDirectory ? 'file' : 'folder',
        ...(isLast && !isDirectory ? { size } : { children: [] })
      }
      current.children.push(existing)
    }

    current = existing
  }
}

function readZipFileTree(filePath: string, rootName: string): SubmissionTreeNode {
  const zip = new AdmZip(filePath)
  const zipEntries = zip.getEntries()
  
  const root: SubmissionTreeNode = {
    name: rootName,
    path: '',
    type: 'folder',
    children: []
  }

  for (const entry of zipEntries) {
    const safePath = sanitizeZipEntryPath(entry.entryName)
    if (!safePath || safePath.startsWith('__MACOSX/')) continue

    const size = entry.header.size
    addPathToTree(root, safePath, size, entry.isDirectory)
  }

  sortTreeNodes(root.children || [])
  return root
}

function isTextFile(fileName: string, mimeType = '') {
  const ext = path.extname(fileName).toLowerCase()
  return mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml') || TEXT_FILE_EXTENSIONS.has(ext)
}

function looksBinary(buffer: Buffer) {
  const sampleSize = Math.min(buffer.length, 1024)
  for (let index = 0; index < sampleSize; index++) {
    if (buffer[index] === 0) return true
  }
  return false
}

function createSampleZipBuffer(entries: { name: string; content: string }[]): Buffer {
  const localBuffers: Buffer[] = []
  const centralBuffers: Buffer[] = []
  let localOffset = 0

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8')
    const contentBuf = Buffer.from(entry.content, 'utf8')
    const crc = crc32(contentBuf)
    const size = contentBuf.length

    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(0, 8)
    localHeader.writeUInt32LE(0, 10)
    localHeader.writeUInt32LE(crc >>> 0, 14)
    localHeader.writeUInt32LE(size, 18)
    localHeader.writeUInt32LE(size, 22)
    localHeader.writeUInt16LE(nameBuf.length, 26)
    localHeader.writeUInt16LE(0, 28)

    localBuffers.push(localHeader, nameBuf, contentBuf)

    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)
    centralHeader.writeUInt16LE(20, 4)
    centralHeader.writeUInt16LE(20, 6)
    centralHeader.writeUInt16LE(0, 8)
    centralHeader.writeUInt16LE(0, 10)
    centralHeader.writeUInt32LE(0, 12)
    centralHeader.writeUInt32LE(crc >>> 0, 16)
    centralHeader.writeUInt32LE(size, 20)
    centralHeader.writeUInt32LE(size, 24)
    centralHeader.writeUInt16LE(nameBuf.length, 28)
    centralHeader.writeUInt16LE(0, 30)
    centralHeader.writeUInt16LE(0, 32)
    centralHeader.writeUInt16LE(0, 34)
    centralHeader.writeUInt16LE(0, 36)
    centralHeader.writeUInt32LE(0, 38)
    centralHeader.writeUInt32LE(localOffset, 42)

    centralBuffers.push(centralHeader, nameBuf)
    localOffset += 30 + nameBuf.length + size
  }

  const cdBuffer = Buffer.concat(centralBuffers)
  const cdSize = cdBuffer.length

  const eocdHeader = Buffer.alloc(22)
  eocdHeader.writeUInt32LE(0x06054b50, 0)
  eocdHeader.writeUInt16LE(0, 4)
  eocdHeader.writeUInt16LE(0, 6)
  eocdHeader.writeUInt16LE(entries.length, 8)
  eocdHeader.writeUInt16LE(entries.length, 10)
  eocdHeader.writeUInt32LE(cdSize, 12)
  eocdHeader.writeUInt32LE(localOffset, 16)
  eocdHeader.writeUInt16LE(0, 20)

  return Buffer.concat([...localBuffers, cdBuffer, eocdHeader])
}

class SubmissionsService {
  async createSubmission(gradeItemId: string, studentId: string, file: UploadedSubmissionFile, note = '', groupMembersStr = '') {
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

    const [classData, classMembership] = await Promise.all([
      databaseService.classes.findOne({
        _id: gradeItem.classId,
        isActive: { $ne: false },
        $or: [
          { 'students.studentId': studentObjectId },
          { studentIds: studentObjectId },
          { studentIds: studentObjectId.toHexString() }
        ]
      } as any),
      databaseService.classMembers.findOne({
        classId: gradeItem.classId,
        studentId: studentObjectId,
        status: { $ne: 'dropped' }
      })
    ])

    if (!classData && !classMembership) {
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

    let groupMembers: ObjectId[] = []
    if (groupMembersStr) {
      try {
        const parsed = JSON.parse(groupMembersStr)
        if (Array.isArray(parsed)) {
          groupMembers = parsed.map((id: string) => toObjectId(id, 'Group member'))
        }
      } catch (e) {
        console.error('Failed to parse groupMembers', e)
      }
    }

    const membersToCheck = groupMembers.length > 0 ? groupMembers : [studentObjectId]
    const otherSubmissions = await databaseService.submissions.find({
      gradeItemId: gradeItemObjectId,
      groupMembers: { $in: membersToCheck },
      isLatest: true,
      studentId: { $ne: studentObjectId }
    }).toArray()
    
    if (otherSubmissions.length > 0) {
      removeFileIfExists(finalFilePath)
      throw new ErrorWithStatus({
        message: 'You or one of the selected members are already part of another group submission.',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

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
      note,
      groupMembers
    })

    const result = await databaseService.submissions.insertOne(newSubmission)
    return { ...newSubmission, _id: result.insertedId }
  }

  async getMySubmissionByGradeItem(gradeItemId: string, studentId: string) {
    return await databaseService.submissions.findOne(
      {
        gradeItemId: toObjectId(gradeItemId, 'Grade item'),
        $or: [
          { studentId: toObjectId(studentId, 'Student') },
          { groupMembers: toObjectId(studentId, 'Student') }
        ],
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
            $or: [
              { 'lecturer.lecturerId': userObjectId },
              { 'lecturer.lecturerId': userObjectId.toHexString() },
              { lecturerId: userObjectId },
              { lecturerId: userObjectId.toHexString() }
            ]
          } as any)

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

  async getGroupedStudentsByGradeItem(gradeItemId: string) {
    const gradeItemObjectId = toObjectId(gradeItemId, 'Grade item')
    
    const submissions = await databaseService.submissions.find({
      gradeItemId: gradeItemObjectId,
      isLatest: true
    }).toArray()
    
    const groupedStudentIds = new Set<string>()
    for (const sub of submissions) {
      if (sub.groupMembers && sub.groupMembers.length > 0) {
        for (const member of sub.groupMembers) {
          groupedStudentIds.add(member.toString())
        }
      }
      groupedStudentIds.add(sub.studentId.toString())
    }
    
    return Array.from(groupedStudentIds)
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

  async deleteSubmission(id: string) {
    await databaseService.submissions.deleteOne({ _id: toObjectId(id, 'Submission') })
  }

  async getSubmissionDetailById(id: string, user: User) {
    // First run the standard check
    const rawSubmission = await this.getSubmissionById(id, user)

    const submissions = await databaseService.submissions
      .aggregate([
        { $match: { _id: rawSubmission._id } },
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'studentId'
          }
        },
        { $unwind: { path: '$studentId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'classes',
            localField: 'classId',
            foreignField: '_id',
            as: 'classId'
          }
        },
        { $unwind: { path: '$classId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'grade_items',
            localField: 'gradeItemId',
            foreignField: '_id',
            as: 'gradeItemId'
          }
        },
        { $unwind: { path: '$gradeItemId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'groupMembers',
            foreignField: '_id',
            as: 'groupMembers'
          }
        }
      ])
      .toArray()

    return submissions[0]
  }

  async getMySubmissions(studentId: string) {
    const studentObjectId = toObjectId(studentId, 'Student')
    return await databaseService.submissions
      .aggregate([
        {
          $match: {
            $or: [{ studentId: studentObjectId }, { groupMembers: studentObjectId }],
            isLatest: true
          }
        },
        {
          $lookup: {
            from: 'grade_items',
            localField: 'gradeItemId',
            foreignField: '_id',
            as: 'gradeItem'
          }
        },
        { $unwind: { path: '$gradeItem', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'classes',
            localField: 'classId',
            foreignField: '_id',
            as: 'class'
          }
        },
        { $unwind: { path: '$class', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'grades',
            let: { submissionId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$submissionId', '$$submissionId'] },
                      { $eq: ['$studentId', studentObjectId] }
                    ]
                  }
                }
              }
            ],
            as: 'grade'
          }
        },
        { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'ai_evaluations',
            localField: '_id',
            foreignField: 'submissionId',
            as: 'aiEvaluation'
          }
        },
        { $unwind: { path: '$aiEvaluation', preserveNullAndEmptyArrays: true } },
        { $sort: { submittedAt: -1 } }
      ])
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

  getSubmissionFilePath(submission: any) {
    if (!submission.fileStorageKey) {
      const safeName = submission.fileName || 'submission.zip'
      return path.join(process.cwd(), 'uploads', 'submissions', safeName)
    }
    return path.join(process.cwd(), submission.fileStorageKey)
  }

  async getSubmissionFileTree(submissionId: string, user: User) {
    const submission = await this.getSubmissionById(submissionId, user)
    const filePath = this.getSubmissionFilePath(submission)

    if (!fs.existsSync(filePath)) {
      throw new ErrorWithStatus({
        message: 'Submission file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isZip = path.extname(submission.fileName).toLowerCase() === '.zip' || submission.mimeType.includes('zip')
    const tree = isZip
      ? readZipFileTree(filePath, submission.fileName)
      : {
          name: submission.fileName,
          path: submission.fileName,
          type: 'file' as const,
          size: submission.fileSize,
          mimeType: submission.mimeType
        }

    return {
      submissionId,
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      mimeType: submission.mimeType,
      isArchive: isZip,
      tree
    }
  }

  async getSubmissionFileContent(submissionId: string, user: User, query: SubmissionFileContentQuery = {}) {
    const submission = await this.getSubmissionById(submissionId, user)
    const filePath = this.getSubmissionFilePath(submission)

    if (!fs.existsSync(filePath)) {
      throw new ErrorWithStatus({
        message: 'Submission file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isZip = path.extname(submission.fileName).toLowerCase() === '.zip' || submission.mimeType.includes('zip')

    if (!isZip) {
      const requestedPath = query.path ? sanitizeZipEntryPath(query.path) : submission.fileName
      if (requestedPath !== submission.fileName) {
        throw new ErrorWithStatus({
          message: 'File path not found in submission',
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      const isTooLarge = submission.fileSize > MAX_TEXT_PREVIEW_SIZE

      if (isTooLarge) {
        const guessedIsText = isTextFile(submission.fileName, submission.mimeType)
        return {
          submissionId,
          path: submission.fileName,
          fileName: submission.fileName,
          size: submission.fileSize,
          mimeType: submission.mimeType,
          type: guessedIsText ? 'text' : 'binary',
          isText: guessedIsText,
          content: null,
          truncated: false,
          downloadUrl: `/api/submissions/${submissionId}/download`
        }
      }

      const contentBuffer = fs.readFileSync(filePath)
      const isBinary = looksBinary(contentBuffer)

      return {
        submissionId,
        path: submission.fileName,
        fileName: submission.fileName,
        size: submission.fileSize,
        mimeType: submission.mimeType,
        type: isBinary ? 'binary' : 'text',
        isText: !isBinary,
        content: isBinary ? null : contentBuffer.toString('utf8'),
        truncated: false,
        downloadUrl: `/api/submissions/${submissionId}/download`
      }
    }

    const requestedPath = sanitizeZipEntryPath(query.path || '')
    if (!requestedPath) {
      throw new ErrorWithStatus({
        message: 'File path is required for ZIP submissions',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const zip = new AdmZip(filePath)
    const zipEntries = zip.getEntries()
    const entry = zipEntries.find((zipEntry) => sanitizeZipEntryPath(zipEntry.entryName) === requestedPath)

    if (!entry) {
      throw new ErrorWithStatus({
        message: 'File path not found in submission',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (entry.isDirectory) {
      throw new ErrorWithStatus({
        message: 'Selected path is a folder',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const isTooLarge = entry.header.size > MAX_TEXT_PREVIEW_SIZE

    if (isTooLarge) {
      const guessedIsText = isTextFile(requestedPath)
      return {
        submissionId,
        path: requestedPath,
        fileName: path.basename(requestedPath),
        size: entry.header.size,
        mimeType: 'application/octet-stream',
        type: guessedIsText ? 'text' : 'binary',
        isText: guessedIsText,
        content: null,
        truncated: false,
        downloadUrl: `/api/submissions/${submissionId}/download`
      }
    }

    const contentBuffer = entry.getData()
    const isBinary = looksBinary(contentBuffer)

    return {
      submissionId,
      path: requestedPath,
      fileName: path.basename(requestedPath),
      size: entry.header.size,
      mimeType: 'text/plain',
      type: isBinary ? 'binary' : 'text',
      isText: !isBinary,
      content: isBinary ? null : contentBuffer.toString('utf8'),
      truncated: false,
      downloadUrl: `/api/submissions/${submissionId}/download`
    }
  }

  async getSubmissionDownloadFile(submissionId: string, user: User, query: SubmissionFileContentQuery = {}) {
    const submission = await this.getSubmissionById(submissionId, user)
    const filePath = this.getSubmissionFilePath(submission)

    if (!fs.existsSync(filePath)) {
      throw new ErrorWithStatus({
        message: 'Submission file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isZip = path.extname(submission.fileName).toLowerCase() === '.zip' || submission.mimeType.includes('zip')
    const requestedPath = query.path ? sanitizeZipEntryPath(query.path) : ''

    if (!requestedPath) {
      return {
        filePath,
        fileName: submission.fileName,
        mimeType: submission.mimeType
      }
    }

    if (!isZip) {
      if (requestedPath !== submission.fileName) {
        throw new ErrorWithStatus({
          message: 'File path not found in submission',
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      return {
        filePath,
        fileName: submission.fileName,
        mimeType: submission.mimeType
      }
    }

    const zip = new AdmZip(filePath)
    const zipEntries = zip.getEntries()
    const entry = zipEntries.find((zipEntry) => sanitizeZipEntryPath(zipEntry.entryName) === requestedPath)

    if (!entry) {
      throw new ErrorWithStatus({
        message: 'File path not found in submission',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const buffer = entry.getData()

    return {
      buffer,
      fileName: path.basename(requestedPath),
      mimeType: isTextFile(requestedPath) ? 'text/plain' : 'application/octet-stream'
    }
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

    if (declarationRequired && interactionCount < minInteractions) {
      throw new ErrorWithStatus({
        message: `At least ${minInteractions} AI declarations are required before finalizing this submission`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (maxInteractions > 0 && interactionCount > maxInteractions) {
      throw new ErrorWithStatus({
        message: `No more than ${maxInteractions} AI declarations are allowed for this submission`,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const now = new Date()
    const deadline = new Date(gradeItem.deadline)
    const status = now <= deadline ? 'submitted' : 'late'

    const result = await databaseService.submissions.findOneAndUpdate(
      { _id: submissionObjectId },
      {
        $set: {
          status,
          finalizedAt: now,
          aiRequirementSatisfied: !declarationRequired || interactionCount >= minInteractions,
          aiInteractionCount: interactionCount,
          updatedAt: now
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }

  async createSubmissionVersionWithoutFile(currentSubmission: any, studentId: string, note = '', groupMembersStr = '') {
    const studentObjectId = toObjectId(studentId, 'Student')

    const latestSubmission = await databaseService.submissions.findOne(
      {
        gradeItemId: currentSubmission.gradeItemId,
        studentId: studentObjectId
      },
      {
        sort: { versionNumber: -1 }
      }
    )

    const versionNumber = latestSubmission ? latestSubmission.versionNumber + 1 : currentSubmission.versionNumber + 1

    await databaseService.submissions.updateMany(
      {
        gradeItemId: currentSubmission.gradeItemId,
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

    let groupMembers: ObjectId[] = []
    if (groupMembersStr) {
      try {
        const parsed = JSON.parse(groupMembersStr)
        if (Array.isArray(parsed)) {
          groupMembers = parsed.map((id: string) => toObjectId(id, 'Group member'))
        }
      } catch (e) {
        console.error('Failed to parse groupMembers', e)
      }
    } else {
      groupMembers = currentSubmission.groupMembers || []
    }

    const membersToCheck = groupMembers.length > 0 ? groupMembers : [studentObjectId]
    const otherSubmissions = await databaseService.submissions.find({
      gradeItemId: currentSubmission.gradeItemId,
      groupMembers: { $in: membersToCheck },
      isLatest: true,
      studentId: { $ne: studentObjectId }
    }).toArray()
    
    if (otherSubmissions.length > 0) {
      throw new ErrorWithStatus({
        message: 'You or one of the selected members are already part of another group submission.',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const newSubmission = new Submission({
      uuid: currentSubmission.uuid, // Keep same UUID to map to same file
      gradeItemId: currentSubmission.gradeItemId,
      classId: currentSubmission.classId,
      studentId: studentObjectId,
      versionNumber,
      fileName: currentSubmission.fileName,
      fileStorageKey: currentSubmission.fileStorageKey,
      fileSize: currentSubmission.fileSize,
      mimeType: currentSubmission.mimeType,
      contentHash: currentSubmission.contentHash,
      note: note || currentSubmission.note,
      groupMembers
    })

    const result = await databaseService.submissions.insertOne(newSubmission)
    return { ...newSubmission, _id: result.insertedId }
  }

  async resubmitSubmissionVersion(submissionId: string, studentId: string, file: UploadedSubmissionFile | undefined, note = '', groupMembersStr = '') {
    const currentSubmission = await this.getSubmissionById(submissionId, {
      _id: toObjectId(studentId, 'Student'),
      role: 'STUDENT'
    } as User)

    if (!file) {
      // If it is a draft, we don't need a new version, just update the existing one
      if (currentSubmission.status === 'draft') {
        let groupMembers: ObjectId[] = currentSubmission.groupMembers || []
        if (groupMembersStr) {
          try {
            const parsed = JSON.parse(groupMembersStr)
            if (Array.isArray(parsed)) {
              groupMembers = parsed.map((id: string) => toObjectId(id, 'Group member'))
            }
          } catch (e) {
            console.error('Failed to parse groupMembers', e)
          }
        }

        const studentObjectId = toObjectId(studentId, 'Student')
        const membersToCheck = groupMembers.length > 0 ? groupMembers : [studentObjectId]
        const otherSubmissions = await databaseService.submissions.find({
          gradeItemId: currentSubmission.gradeItemId,
          groupMembers: { $in: membersToCheck },
          isLatest: true,
          studentId: { $ne: studentObjectId }
        }).toArray()
        
        if (otherSubmissions.length > 0) {
          throw new ErrorWithStatus({
            message: 'You or one of the selected members are already part of another group submission.',
            status: HTTP_STATUS.FORBIDDEN
          })
        }

        return await databaseService.submissions.findOneAndUpdate(
          { _id: currentSubmission._id },
          {
            $set: {
              note: note || currentSubmission.note,
              groupMembers,
              submittedAt: new Date(),
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )
      }
      
      // If it's finalized, create a new version without modifying the file
      return await this.createSubmissionVersionWithoutFile(currentSubmission, studentId, note, groupMembersStr)
    }

    if (currentSubmission.status === 'draft') {
      removeFileIfExists(this.getSubmissionFilePath(currentSubmission))

      const uuid = randomUUID()
      const ext = path.extname(file.originalFilename).toLowerCase()
      const storageFileName = `${uuid}${ext}`
      const fileStorageKey = path.join('uploads', 'submissions', storageFileName)
      const finalFilePath = path.join(process.cwd(), fileStorageKey)

      ensureSubmissionUploadDir()
      fs.renameSync(file.filepath, finalFilePath)

      let groupMembers: ObjectId[] = currentSubmission.groupMembers || []
      if (groupMembersStr) {
        try {
          const parsed = JSON.parse(groupMembersStr)
          if (Array.isArray(parsed)) {
            groupMembers = parsed.map((id: string) => toObjectId(id, 'Group member'))
          }
        } catch (e) {
          console.error('Failed to parse groupMembers', e)
        }
      }

      const studentObjectId = toObjectId(studentId, 'Student')
      const membersToCheck = groupMembers.length > 0 ? groupMembers : [studentObjectId]
      const otherSubmissions = await databaseService.submissions.find({
        gradeItemId: currentSubmission.gradeItemId,
        groupMembers: { $in: membersToCheck },
        isLatest: true,
        studentId: { $ne: studentObjectId }
      }).toArray()
      
      if (otherSubmissions.length > 0) {
        removeFileIfExists(finalFilePath)
        throw new ErrorWithStatus({
          message: 'You or one of the selected members are already part of another group submission.',
          status: HTTP_STATUS.FORBIDDEN
        })
      }

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
            groupMembers,
            submittedAt: new Date(),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )
    }

    return await this.createSubmission(currentSubmission.gradeItemId.toString(), studentId, file, note, groupMembersStr)
  }

  async updateSubmissionGroupMembers(id: string, user: User, groupMembersStr: string[]) {
    const submission = await this.getSubmissionById(id, user)
    const userId = user._id as ObjectId

    if (submission.studentId.toString() !== userId.toString()) {
      throw new ErrorWithStatus({
        message: 'You can only update your own submissions',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    // Allow updating group members even if finalized


    const membersToCheck = groupMembersStr.length > 0 ? groupMembersStr.map((id: string) => toObjectId(id, 'Group member')) : [userId]
    
    // Check if any of these members are already in another group submission
    const otherSubmissions = await databaseService.submissions.find({
      gradeItemId: submission.gradeItemId,
      groupMembers: { $in: membersToCheck },
      isLatest: true,
      studentId: { $ne: userId },
      _id: { $ne: submission._id }
    }).toArray()
    
    if (otherSubmissions.length > 0) {
      throw new ErrorWithStatus({
        message: 'You or one of the selected members are already part of another group submission.',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const result = await databaseService.submissions.findOneAndUpdate(
      { _id: submission._id },
      {
        $set: {
          groupMembers: membersToCheck,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
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
        $or: [
          { 'lecturer.lecturerId': userId },
          { 'lecturer.lecturerId': userId.toHexString() },
          { lecturerId: userId },
          { lecturerId: userId.toHexString() }
        ]
      } as any)

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
