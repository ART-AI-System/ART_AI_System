import { Request, Response, NextFunction } from 'express'
import formidable, { Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'

// ==========================================
// IMPORT MIDDLEWARE
// ==========================================
// Parses a multipart/form-data upload containing a CSV or Excel file.
// After parsing, attaches the row array to req.importRows.
// The controller then passes these rows to usersService.importUsers().
//
// Supported formats:
//   .csv   — parsed using built-in string splitting
//   .xlsx  — requires 'xlsx' package (optional; graceful error if not installed)
//   .xls   — same as .xlsx
// ==========================================

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls']
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'import')

/**
 * Parses a CSV string into an array of row objects.
 * The first row is treated as the header.
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    if (values.length === 0 || values.every((v) => v === '')) continue
    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? ''
    })
    rows.push(row)
  }

  return rows
}

/**
 * Parses an Excel buffer into an array of row objects.
 * Falls back gracefully if the 'xlsx' package is not installed.
 */
function parseExcel(buffer: Buffer): Record<string, string>[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XLSX = require('xlsx')
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, string>[]
  } catch {
    throw new ErrorWithStatus({
      message: 'Excel parsing failed. Ensure the file is a valid .xlsx or .xls file.',
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

/**
 * Express middleware that:
 *   1. Parses multipart/form-data to extract the uploaded file.
 *   2. Validates file extension (.csv, .xlsx, .xls).
 *   3. Parses the file into a row array.
 *   4. Attaches the parsed rows to req.importRows.
 *   5. Cleans up the temp file after parsing.
 */
export const parseImportFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Ensure upload temp directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  const form = formidable({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB limit for import files
    multiples: false
  })

  try {
    await new Promise<void>((resolve, reject) => {
      form.parse(req, (err: Error | null, _fields: any, files: Files) => {
        if (err) {
          return reject(
            new ErrorWithStatus({
              message: `File upload error: ${err.message}`,
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        // Support both array and direct file reference
        const fileRaw = files.file
        const file = Array.isArray(fileRaw) ? fileRaw[0] : fileRaw

        if (!file) {
          return reject(
            new ErrorWithStatus({
              message: USERS_MESSAGES.IMPORT_FILE_REQUIRED,
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        const originalName = file.originalFilename || ''
        const ext = path.extname(originalName).toLowerCase()
        const tempPath = file.filepath

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          // Clean up temp file
          fs.unlink(tempPath, () => {})
          return reject(
            new ErrorWithStatus({
              message: USERS_MESSAGES.IMPORT_INVALID_FILE_TYPE,
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }

        try {
          let rows: Record<string, string>[]

          if (ext === '.csv') {
            const content = fs.readFileSync(tempPath, 'utf-8')
            rows = parseCSV(content)
          } else {
            const buffer = fs.readFileSync(tempPath)
            rows = parseExcel(buffer)
          }

          // Clean up temp file
          fs.unlink(tempPath, () => {})

          // Attach parsed rows to request for the controller
          ;(req as any).importRows = rows
          resolve()
        } catch (parseErr) {
          fs.unlink(tempPath, () => {})
          reject(parseErr)
        }
      })
    })

    next()
  } catch (error) {
    next(error)
  }
}
