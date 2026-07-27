import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from 'express'
import formidable, { Files } from 'formidable'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['.docx']
const UPLOAD_TEMP_DIR = path.join(process.cwd(), 'uploads', 'tests', 'temp')

export interface UploadedTestImportFile {
  filepath: string
  originalFilename: string | null
  mimetype: string | null
  size: number
}

export const parseTestImportFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true })
  }

  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
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

        const fileArray = files.file
        if (!fileArray || fileArray.length === 0) {
          return reject(
            new ErrorWithStatus({
              message: 'No file uploaded. Please provide a file in the "file" field.',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        const uploadedFile = fileArray[0]
        const ext = path.extname(uploadedFile.originalFilename || '').toLowerCase()

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          // Remove invalid file
          fs.unlink(uploadedFile.filepath, () => {})
          return reject(
            new ErrorWithStatus({
              message: `Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`,
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        // Attach parsed fields and file to the request object
        req.body = { ...req.body, ...fields }
        ;(req as any).file = {
          filepath: uploadedFile.filepath,
          originalFilename: uploadedFile.originalFilename,
          mimetype: uploadedFile.mimetype,
          size: uploadedFile.size
        } as any

        // Formidable parses fields as arrays. We need to unwrap them if they are single values.
        for (const key in req.body) {
          if (Array.isArray(req.body[key]) && req.body[key].length === 1) {
            req.body[key] = req.body[key][0]
          }
        }

        resolve()
      })
    })

    next()
  } catch (error) {
    next(error)
  }
}
