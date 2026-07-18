import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import reportService from '~/services/report.services'

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Resolve a safe filename component from a class document.
// Falls back to classId if the class is not found or has no classCode.
// ─────────────────────────────────────────────────────────────────────────────
async function resolveFilename(classId: string): Promise<string> {
  const classMeta = await reportService.getClassMeta(classId)
  return classMeta?.classCode
    ? classMeta.classCode.replace(/[^a-zA-Z0-9\-_]/g, '_')
    : classId
}

// ─────────────────────────────────────────────────────────────────────────────
// 9.1 — Academic Reports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/reports/classes/:classId/grade-summary
 * Returns per-grade-item score distribution across classification brackets.
 */
export const getGradeSummaryController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params['classId'] as string
    const result = await reportService.getGradeSummary(classId)
    res.json({
      message: 'Get grade summary successfully',
      result
    })
  }
)

/**
 * GET /api/reports/classes/:classId/final-results
 * Returns all pre-computed final results with enriched student snapshot info.
 */
export const getFinalResultsReportController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params['classId'] as string
    const result = await reportService.getFinalResults(classId)
    res.json({
      message: 'Get final results report successfully',
      result
    })
  }
)

/**
 * GET /api/reports/classes/:classId/rankings
 * Returns students ranked by final score (descending), rank field injected.
 */
export const getRankingsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params['classId'] as string
    const result = await reportService.getRankings(classId)
    res.json({
      message: 'Get rankings successfully',
      result
    })
  }
)

/**
 * GET /api/reports/classes/:classId/classifications
 * Returns aggregate count of each academic classification bucket for the class.
 */
export const getClassificationsController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params['classId'] as string
    const result = await reportService.getClassifications(classId)
    res.json({
      message: 'Get classifications successfully',
      result
    })
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// 9.2 — AI Usage Reports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/reports/classes/:classId/ai-usage
 * Returns AI pattern distribution and tool frequency for a single class.
 */
export const getClassAiUsageController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const classId = req.params['classId'] as string
    const result = await reportService.getClassAiUsage(classId)
    res.json({
      message: 'Get class AI usage report successfully',
      result
    })
  }
)

export const getSubjectAiUsageController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const subjectId = req.params['subjectId'] as string
    const result = await reportService.getSubjectAiUsage(subjectId)
    res.json({
      message: 'Get subject AI usage report successfully',
      result
    })
  }
)

/**
 * GET /api/reports/semesters/:semester/ai-usage
 * Returns semester-wide AI usage trends across all classes.
 */
export const getSemesterAiUsageController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const semester = req.params['semester'] as string
    const result = await reportService.getSemesterAiUsage(semester)
    res.json({
      message: 'Get semester AI usage report successfully',
      result
    })
  }
)

/**
 * GET /api/reports/suspicious-cases
 * Returns all unresolved high-suspect flags, optionally filtered by ?semester= or ?classId=
 */
export const getSuspiciousCasesController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const semester = req.query['semester'] as string | undefined
    const classId = req.query['classId'] as string | undefined
    const result = await reportService.getSuspiciousCases({ semester, classId })
    res.json({
      message: 'Get suspicious cases successfully',
      result
    })
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// 9.3 — Export Reports
// ─────────────────────────────────────────────────────────────────────────────

export const exportReportController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Determine scope based on available params
    const classId = req.params['classId'] as string | undefined
    const subjectId = req.params['subjectId'] as string | undefined
    const semesterId = req.params['semesterId'] as string | undefined
    
    // Type and format from query
    const format = (req.query['format'] as string) || 'csv'
    
    // We delegate the unified export handling to reportService
    const scopeId = classId || subjectId || semesterId || 'unknown'
    const scopeType = classId ? 'class' : subjectId ? 'subject' : 'semester'
    
    const filename = await resolveFilename(scopeId)
    
    if (format === 'xlsx') {
      const buffer = await reportService.exportExcel(scopeId)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename="${scopeType}-${filename}-report.xlsx"`)
      res.setHeader('Content-Length', buffer.length)
      res.send(buffer)
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${scopeType}-${filename}-report.pdf"`)
      await reportService.exportPdf(scopeId, res)
    } else {
      // Default to csv
      const csvContent = await reportService.exportCsv(scopeId)
      const body = '\uFEFF' + csvContent
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="${scopeType}-${filename}-results.csv"`)
      res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'))
      res.send(body)
    }
  }
)
