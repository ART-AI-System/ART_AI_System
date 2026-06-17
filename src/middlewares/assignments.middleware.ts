import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from 'express'
import formidable, { Files } from 'formidable'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

const MAX_MATERIAL_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.zip']
const UPLOAD_TEMP_DIR = path.join(process.cwd(), 'uploads', 'assignment-materials', 'temp')

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

export const parseAssignmentMaterialFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true })
  }

  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    keepExtensions: true,
    maxFileSize: MAX_MATERIAL_FILE_SIZE,
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
              message: 'Assignment material file is required',
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
              message: 'Assignment material file must be PDF, DOCX, PPTX, or ZIP',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        req.assignmentMaterialFile = {
          originalFilename,
          filepath: file.filepath,
          mimetype: file.mimetype || 'application/octet-stream',
          size: file.size,
          contentHash: getFileHash(file.filepath)
        } satisfies UploadedAssignmentMaterialFile

        req.body = {
          title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
          description: Array.isArray(fields.description) ? fields.description[0] : fields.description
        }

        resolve()
      })
    })

    next()
  } catch (error) {
    next(error)
  }
}
