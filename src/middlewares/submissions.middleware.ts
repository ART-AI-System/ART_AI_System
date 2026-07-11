import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from 'express'
import formidable, { Files } from 'formidable'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { SubmissionUploadFields, UploadedSubmissionFile } from '~/models/requests/submissions.request'

const MAX_SUBMISSION_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.pptx', '.zip', '.txt']
const UPLOAD_TEMP_DIR = path.join(process.cwd(), 'uploads', 'submissions', 'temp')

function getFileHash(filePath: string) {
  const hash = createHash('sha256')
  const buffer = fs.readFileSync(filePath)
  hash.update(buffer)
  return hash.digest('hex')
}

function removeFileIfExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, () => {})
  }
}

export const parseSubmissionFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true })
  }

  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    keepExtensions: true,
    maxFileSize: MAX_SUBMISSION_FILE_SIZE,
    multiples: false
  })

  try {
    await new Promise<void>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: any, files: Files) => {
        if (err) {
          return reject(
            new ErrorWithStatus({
              message: `File upload error: ${err.message}`,
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        const fileRaw = files.file
        const file = Array.isArray(fileRaw) ? fileRaw[0] : fileRaw

        if (!file) {
          return reject(
            new ErrorWithStatus({
              message: 'Submission file is required',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        const originalFilename = file.originalFilename || ''
        const ext = path.extname(originalFilename).toLowerCase()

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          removeFileIfExists(file.filepath)
          return reject(
            new ErrorWithStatus({
              message: 'Submission file must be PDF, DOCX, XLSX, PPTX, ZIP, or TXT',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        req.submissionFile = {
          originalFilename,
          filepath: file.filepath,
          mimetype: file.mimetype || 'application/octet-stream',
          size: file.size,
          contentHash: getFileHash(file.filepath)
        } satisfies UploadedSubmissionFile

        const noteRaw = fields.note
        const note = Array.isArray(noteRaw) ? noteRaw[0] : noteRaw
        req.body = {
          ...req.body,
          ...(typeof note === 'string' ? { note: note.trim() } : {})
        } satisfies SubmissionUploadFields

        resolve()
      })
    })

    next()
  } catch (error) {
    next(error)
  }
}
