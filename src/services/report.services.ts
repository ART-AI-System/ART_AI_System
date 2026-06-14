import { ObjectId } from 'mongodb'
import * as XLSX from 'xlsx'
import PDFDocument from 'pdfkit'
import { Response } from 'express'
import databaseService from './database.service'

type Classification = 'poor' | 'average' | 'good' | 'very_good' | 'excellent'

interface StudentSnapshot {
  studentId: ObjectId
  studentCode: string
  fullName: string
  email: string
}

function scoreToClassification(score: number): Classification {
  if (score >= 9) return 'excellent'
  if (score >= 8) return 'very_good'
  if (score >= 6.5) return 'good'
  if (score >= 5) return 'average'
  return 'poor'
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: escape a CSV cell value per RFC 4180
// ─────────────────────────────────────────────────────────────────────────────
function escapeCsvCell(value: any): string {
  const str = String(value ?? '')
  // If the value contains a comma, double-quote, or newline — wrap and escape
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// ─────────────────────────────────────────────────────────────────────────────
// $switch branch array for normalised-score → classification bracket
// Reused in aggregation stages to avoid repeating the switch literal
// ─────────────────────────────────────────────────────────────────────────────
const CLASSIFICATION_SWITCH = {
  branches: [
    { case: { $gte: ['$$score', 9] }, then: 'excellent' },
    { case: { $gte: ['$$score', 8] }, then: 'very_good' },
    { case: { $gte: ['$$score', 6.5] }, then: 'good' },
    { case: { $gte: ['$$score', 5] }, then: 'average' }
  ],
  default: 'poor'
}

// ─────────────────────────────────────────────────────────────────────────────
class ReportService {
  // ───────────────────────────────────────────────────────────────────────────
  // 9.1 — GET /reports/classes/:classId/grade-summary
  //
  // Returns per-grade-item distribution across bracket bands.
  // Reads: grades → joins grade_items for title/weight context.
  // ───────────────────────────────────────────────────────────────────────────
  async getGradeSummary(classId: string) {
    const classOid = new ObjectId(classId)

    const result = await databaseService.grades
      .aggregate([
        // Stage 1 — scope to this class only
        { $match: { classId: classOid } },

        // Stage 2 — join grade_items for title
        {
          $lookup: {
            from: process.env.DB_GRADE_ITEMS_COLLECTION || 'grade_items',
            localField: 'gradeItemId',
            foreignField: '_id',
            as: 'gradeItem'
          }
        },
        { $unwind: '$gradeItem' },

        // Stage 3 — normalise score to 10-point scale
        {
          $addFields: {
            normalisedScore: {
              $multiply: [{ $divide: ['$score', '$maxScore'] }, 10]
            }
          }
        },

        // Stage 4 — assign classification bracket
        {
          $addFields: {
            bracket: {
              $let: {
                vars: { score: '$normalisedScore' },
                in: { $switch: CLASSIFICATION_SWITCH }
              }
            }
          }
        },

        // Stage 5 — group by grade item + bracket → count + running avg
        {
          $group: {
            _id: {
              gradeItemId: '$gradeItemId',
              gradeItemTitle: '$gradeItem.title',
              bracket: '$bracket'
            },
            count: { $sum: 1 },
            avgNormalised: { $avg: '$normalisedScore' }
          }
        },

        // Stage 6 — pivot: push brackets into an array per grade item
        {
          $group: {
            _id: {
              gradeItemId: '$_id.gradeItemId',
              title: '$_id.gradeItemTitle'
            },
            distribution: {
              $push: { bracket: '$_id.bracket', count: '$count' }
            },
            avgScore: { $avg: '$avgNormalised' }
          }
        },

        // Stage 7 — reshape and sort by title
        {
          $project: {
            _id: 0,
            gradeItemId: '$_id.gradeItemId',
            title: '$_id.title',
            avgScore: { $round: ['$avgScore', 2] },
            distribution: 1
          }
        },
        { $sort: { title: 1 } }
      ])
      .toArray()

    return result
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.1 — GET /reports/classes/:classId/final-results
  //
  // Reads pre-computed final_results. Enriches with student snapshot info
  // stored inside the class document (embedded snapshot pattern).
  // ───────────────────────────────────────────────────────────────────────────
  async getFinalResults(classId: string) {
    const classOid = new ObjectId(classId)

    const results = await databaseService.finalResults
      .aggregate([
        // Stage 1 — scope to class
        { $match: { classId: classOid } },

        // Stage 2 — join the class doc to access its embedded students array
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION || 'classes',
            let: { cid: '$classId', sid: '$studentId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$cid'] } } },
              { $project: { students: 1, _id: 0 } }
            ],
            as: 'classDoc'
          }
        },
        {
          $unwind: {
            path: '$classDoc',
            preserveNullAndEmptyArrays: false
          }
        },

        // Stage 3 — extract the matching student snapshot from the embedded array
        {
          $addFields: {
            studentSnapshot: {
              $first: {
                $filter: {
                  input: '$classDoc.students',
                  as: 's',
                  cond: { $eq: ['$$s.studentId', '$studentId'] }
                }
              }
            }
          }
        },

        // Stage 4 — project only what callers need
        {
          $project: {
            _id: 0,
            studentId: 1,
            fullName: '$studentSnapshot.fullName',
            studentCode: '$studentSnapshot.studentCode',
            email: '$studentSnapshot.email',
            finalScore: 1,
            classification: 1,
            calculatedAt: 1
          }
        },
        { $sort: { finalScore: -1 } }
      ])
      .toArray()

    return results
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.1 — GET /reports/classes/:classId/rankings
  //
  // Extends getFinalResults with a rank field injected via $unwind includeArrayIndex.
  // ───────────────────────────────────────────────────────────────────────────
  async getRankings(classId: string) {
    const classOid = new ObjectId(classId)

    // Reuse the same enrichment pipeline, wrap into an array, then unwind with index
    const ranked = await databaseService.finalResults
      .aggregate([
        { $match: { classId: classOid } },
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION || 'classes',
            let: { cid: '$classId', sid: '$studentId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$cid'] } } },
              { $project: { students: 1, _id: 0 } }
            ],
            as: 'classDoc'
          }
        },
        { $unwind: { path: '$classDoc', preserveNullAndEmptyArrays: false } },
        {
          $addFields: {
            studentSnapshot: {
              $first: {
                $filter: {
                  input: '$classDoc.students',
                  as: 's',
                  cond: { $eq: ['$$s.studentId', '$studentId'] }
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            studentId: 1,
            fullName: '$studentSnapshot.fullName',
            studentCode: '$studentSnapshot.studentCode',
            email: '$studentSnapshot.email',
            finalScore: 1,
            classification: 1,
            calculatedAt: 1
          }
        },
        // Sort descending — highest score = rank 1
        { $sort: { finalScore: -1 } },

        // Collect all into a single array so we can unwind with an index
        {
          $group: {
            _id: null,
            students: { $push: '$$ROOT' }
          }
        },
        {
          $unwind: {
            path: '$students',
            includeArrayIndex: 'rankIndex'
          }
        },
        // rankIndex is 0-based — add 1 for human-readable rank
        {
          $addFields: {
            'students.rank': { $add: ['$rankIndex', 1] }
          }
        },
        { $replaceRoot: { newRoot: '$students' } }
      ])
      .toArray()

    return ranked
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.1 — GET /reports/classes/:classId/classifications
  //
  // Aggregate count of each classification bucket across all students in the class.
  // ───────────────────────────────────────────────────────────────────────────
  async getClassifications(classId: string) {
    const classOid = new ObjectId(classId)

    const result = await databaseService.finalResults
      .aggregate([
        { $match: { classId: classOid } },
        {
          $group: {
            _id: '$classification',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            classification: '$_id',
            count: 1
          }
        },
        { $sort: { classification: 1 } }
      ])
      .toArray()

    return result
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.2 — GET /reports/classes/:classId/ai-usage
  //
  // Pattern distribution from ai_evaluations + tool frequency from ai_interactions.
  // Two-phase strategy: pre-fetch submissionIds for the class, then use $in.
  // ───────────────────────────────────────────────────────────────────────────
  async getClassAiUsage(classId: string) {
    const classOid = new ObjectId(classId)

    // Phase 1 — get all submission _ids for this class (avoids 3-level $lookup)
    const submissionDocs = await databaseService.submissions
      .find({ classId: classOid }, { projection: { _id: 1 } })
      .toArray()
    const submissionIds = submissionDocs.map((s: any) => s._id)

    // Phase 2 — parallel queries
    const [patternDistribution, toolUsage, riskDistribution] = await Promise.all([
      // Pattern distribution from ai_evaluations
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: classOid } },
          {
            $group: {
              _id: '$pattern',
              count: { $sum: 1 },
              avgDependencyScore: { $avg: '$aiDependencyScore' },
              avgCriticalThinkingScore: { $avg: '$criticalThinkingScore' },
              avgPromptQualityScore: { $avg: '$promptQualityScore' },
              avgReflectionQualityScore: { $avg: '$reflectionQualityScore' }
            }
          },
          {
            $project: {
              _id: 0,
              pattern: '$_id',
              count: 1,
              avgDependencyScore: { $round: ['$avgDependencyScore', 2] },
              avgCriticalThinkingScore: { $round: ['$avgCriticalThinkingScore', 2] },
              avgPromptQualityScore: { $round: ['$avgPromptQualityScore', 2] },
              avgReflectionQualityScore: { $round: ['$avgReflectionQualityScore', 2] }
            }
          },
          { $sort: { count: -1 } }
        ])
        .toArray(),

      // AI tool frequency from ai_interactions (scoped via submissionIds)
      submissionIds.length > 0
        ? databaseService.aiInteractions
            .aggregate([
              { $match: { submissionId: { $in: submissionIds } } },
              {
                $group: {
                  _id: '$aiTool',
                  count: { $sum: 1 }
                }
              },
              {
                $project: { _id: 0, tool: '$_id', count: 1 }
              },
              { $sort: { count: -1 } }
            ])
            .toArray()
        : Promise.resolve([]),

      // Risk level distribution
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: classOid } },
          {
            $group: {
              _id: '$riskLevel',
              count: { $sum: 1 }
            }
          },
          {
            $project: { _id: 0, riskLevel: '$_id', count: 1 }
          },
          { $sort: { riskLevel: 1 } }
        ])
        .toArray()
    ])

    return {
      classId,
      patternDistribution,
      toolUsage,
      riskDistribution
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.2 — GET /reports/semesters/:semester/ai-usage
  //
  // Semester-wide AI usage trends across all classes in that semester.
  // Subject Head only.
  // ───────────────────────────────────────────────────────────────────────────
  async getSemesterAiUsage(semester: string) {
    // Step 1 — resolve all class IDs for this semester
    const classDocs = await databaseService.classes
      .find({ semester }, { projection: { _id: 1, classCode: 1, subjectName: 1 } })
      .toArray()

    const classIds = classDocs.map((c: any) => c._id)
    const totalClasses = classIds.length

    if (classIds.length === 0) {
      return {
        semester,
        totalClasses: 0,
        totalStudents: 0,
        patternTrends: [],
        riskDistribution: [],
        toolUsage: [],
        highDependencyCases: 0
      }
    }

    // Step 2 — count total unique students across all these classes
    const studentCountAgg = await databaseService.classes
      .aggregate([
        { $match: { _id: { $in: classIds } } },
        {
          $project: { studentCount: { $size: { $ifNull: ['$students', []] } } }
        },
        { $group: { _id: null, total: { $sum: '$studentCount' } } }
      ])
      .toArray()
    const totalStudents = studentCountAgg[0]?.total ?? 0

    // Step 3 — parallel aggregations on ai_evaluations scoped to semester classIds
    // Collect submission ids for tool usage analysis
    const submissionDocs = await databaseService.submissions
      .find({ classId: { $in: classIds } }, { projection: { _id: 1 } })
      .toArray()
    const submissionIds = submissionDocs.map((s: any) => s._id)

    const [patternTrends, riskDistribution, toolUsage, highDepCount] = await Promise.all([
      // Pattern distribution grouped by pattern
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: { $in: classIds } } },
          {
            $group: {
              _id: '$pattern',
              count: { $sum: 1 },
              avgDependency: { $avg: '$aiDependencyScore' },
              avgCriticalThinking: { $avg: '$criticalThinkingScore' },
              avgPromptQuality: { $avg: '$promptQualityScore' },
              avgReflectionQuality: { $avg: '$reflectionQualityScore' }
            }
          },
          {
            $project: {
              _id: 0,
              pattern: '$_id',
              count: 1,
              avgDependency: { $round: ['$avgDependency', 2] },
              avgCriticalThinking: { $round: ['$avgCriticalThinking', 2] },
              avgPromptQuality: { $round: ['$avgPromptQuality', 2] },
              avgReflectionQuality: { $round: ['$avgReflectionQuality', 2] }
            }
          },
          { $sort: { count: -1 } }
        ])
        .toArray(),

      // Risk distribution
      databaseService.aiEvaluations
        .aggregate([
          { $match: { classId: { $in: classIds } } },
          { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
          { $project: { _id: 0, riskLevel: '$_id', count: 1 } },
          { $sort: { riskLevel: 1 } }
        ])
        .toArray(),

      // AI tool usage frequency across semester
      submissionIds.length > 0
        ? databaseService.aiInteractions
            .aggregate([
              { $match: { submissionId: { $in: submissionIds } } },
              { $group: { _id: '$aiTool', count: { $sum: 1 } } },
              { $project: { _id: 0, tool: '$_id', count: 1 } },
              { $sort: { count: -1 } }
            ])
            .toArray()
        : Promise.resolve([]),

      // Count of high_dependency cases
      databaseService.aiEvaluations.countDocuments({
        classId: { $in: classIds },
        pattern: 'high_dependency'
      })
    ])

    return {
      semester,
      totalClasses,
      totalStudents,
      patternTrends,
      riskDistribution,
      toolUsage,
      highDependencyCases: highDepCount
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9.2 — GET /reports/suspicious-cases
  //
  // Unresolved high-suspect flags, optionally filtered by ?semester= and ?classId=
  // Subject Head only.
  // ───────────────────────────────────────────────────────────────────────────
  async getSuspiciousCases(filters: { semester?: string; classId?: string }) {
    // Build the base match filter
    const matchFilter: Record<string, any> = {
      isResolved: false,
      suspectLevel: 'high'
    }

    if (filters.classId) {
      matchFilter.classId = new ObjectId(filters.classId)
    } else if (filters.semester) {
      // Resolve classIds for the given semester first
      const classDocs = await databaseService.classes
        .find({ semester: filters.semester }, { projection: { _id: 1 } })
        .toArray()
      if (classDocs.length === 0) return []
      matchFilter.classId = { $in: classDocs.map((c: any) => c._id) }
    }

    const results = await databaseService.submissionFlags
      .aggregate([
        { $match: matchFilter },

        // Join submission to get gradeItemId for context
        {
          $lookup: {
            from: process.env.DB_SUBMISSIONS_COLLECTION || 'submissions',
            localField: 'submissionId',
            foreignField: '_id',
            as: 'submission'
          }
        },
        {
          $unwind: { path: '$submission', preserveNullAndEmptyArrays: true }
        },

        // Join class doc for classCode + semester
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION || 'classes',
            localField: 'classId',
            foreignField: '_id',
            as: 'classDoc'
          }
        },
        {
          $unwind: { path: '$classDoc', preserveNullAndEmptyArrays: true }
        },

        // Extract student name from the class embedded snapshot
        {
          $addFields: {
            studentSnapshot: {
              $first: {
                $filter: {
                  input: { $ifNull: ['$classDoc.students', []] },
                  as: 's',
                  cond: { $eq: ['$$s.studentId', '$studentId'] }
                }
              }
            }
          }
        },

        {
          $project: {
            _id: 1,
            flagType: 1,
            description: 1,
            flaggedBy: 1,
            suspectLevel: 1,
            isResolved: 1,
            createdAt: 1,
            studentId: 1,
            studentFullName: '$studentSnapshot.fullName',
            studentCode: '$studentSnapshot.studentCode',
            classId: 1,
            classCode: '$classDoc.classCode',
            subjectName: '$classDoc.subjectName',
            semester: '$classDoc.semester',
            submissionId: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray()

    return results
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9.3 — Export Methods
  // ─────────────────────────────────────────────────────────────────────────

  // ── Excel ──────────────────────────────────────────────────────────────────
  async exportExcel(classId: string): Promise<Buffer> {
    // Fetch data in parallel — both already enriched by their own service methods
    const [finalResults, gradeSummary, classDoc] = await Promise.all([
      this.getFinalResults(classId),
      this.getGradeSummary(classId),
      databaseService.classes.findOne(
        { _id: new ObjectId(classId) },
        { projection: { classCode: 1, subjectName: 1, semester: 1, academicYear: 1 } }
      )
    ])

    const wb = XLSX.utils.book_new()

    // ── Sheet 1: Final Results ───────────────────────────────────────────────
    const sheet1Header = ['#', 'Student Code', 'Full Name', 'Email', 'Final Score (/ 10)', 'Classification']
    const sheet1Rows = finalResults.map((r: any, i: number) => [
      i + 1,
      r.studentCode ?? '',
      r.fullName ?? '',
      r.email ?? '',
      r.finalScore,
      r.classification
    ])
    const ws1 = XLSX.utils.aoa_to_sheet([sheet1Header, ...sheet1Rows])
    // Set column widths for readability
    ws1['!cols'] = [
      { wch: 5 }, // #
      { wch: 14 }, // Student Code
      { wch: 28 }, // Full Name
      { wch: 32 }, // Email
      { wch: 20 }, // Final Score
      { wch: 16 } // Classification
    ]
    XLSX.utils.book_append_sheet(wb, ws1, 'Final Results')

    // ── Sheet 2: Grade Summary ───────────────────────────────────────────────
    const BRACKETS: Classification[] = ['excellent', 'very_good', 'good', 'average', 'poor']
    const sheet2Header = ['Grade Item', 'Avg Score', ...BRACKETS]
    const sheet2Rows = gradeSummary.map((item: any) => {
      const distMap: Record<string, number> = {}
      for (const d of item.distribution ?? []) {
        distMap[d.bracket] = d.count
      }
      return [item.title, item.avgScore, ...BRACKETS.map((b) => distMap[b] ?? 0)]
    })
    const ws2 = XLSX.utils.aoa_to_sheet([sheet2Header, ...sheet2Rows])
    ws2['!cols'] = [
      { wch: 28 }, // Grade Item
      { wch: 12 }, // Avg Score
      { wch: 12 }, // excellent
      { wch: 12 }, // very_good
      { wch: 10 }, // good
      { wch: 10 }, // average
      { wch: 8 } // poor
    ]
    XLSX.utils.book_append_sheet(wb, ws2, 'Grade Summary')

    // Write to buffer — no file-system I/O
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
    return buffer
  }

  // ── PDF ────────────────────────────────────────────────────────────────────
  async exportPdf(classId: string, res: Response): Promise<void> {
    const [finalResults, classDoc] = await Promise.all([
      this.getFinalResults(classId),
      databaseService.classes.findOne(
        { _id: new ObjectId(classId) },
        {
          projection: {
            classCode: 1,
            subjectName: 1,
            semester: 1,
            academicYear: 1,
            'lecturer.fullName': 1
          }
        }
      )
    ])

    // Stream PDF directly into res — no temp file
    const doc = new PDFDocument({ margin: 40, size: 'A4' })
    doc.pipe(res)

    // ── Header block ─────────────────────────────────────────────────────────
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('ART-AI — Final Results Report', { align: 'center' })
      .moveDown(0.4)

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Class Code   : ${classDoc?.classCode ?? classId}`, { align: 'left' })
      .text(`Subject      : ${classDoc?.subjectName ?? '-'}`)
      .text(`Semester     : ${classDoc?.semester ?? '-'}   |   Academic Year: ${classDoc?.academicYear ?? '-'}`)
      .text(`Lecturer     : ${classDoc?.lecturer?.fullName ?? '-'}`)
      .text(`Exported at  : ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' })}`)
      .moveDown(1)

    // ── Table header ─────────────────────────────────────────────────────────
    const COL = { rank: 40, code: 90, name: 200, score: 320, cls: 420 }
    const ROW_H = 18
    const TABLE_TOP = doc.y

    const drawRow = (
      y: number,
      rank: string,
      code: string,
      name: string,
      score: string,
      cls: string,
      isHeader = false
    ) => {
      if (isHeader) {
        doc.rect(36, y - 3, 524, ROW_H).fill('#2c3e50').stroke()
        doc.fillColor('white').font('Helvetica-Bold').fontSize(9)
      } else {
        doc.fillColor('black').font('Helvetica').fontSize(9)
      }
      doc.text(rank, COL.rank, y, { width: 40 })
      doc.text(code, COL.code, y, { width: 100 })
      doc.text(name, COL.name, y, { width: 115 })
      doc.text(score, COL.score, y, { width: 90 })
      doc.text(cls, COL.cls, y, { width: 100 })
      if (!isHeader) {
        // Bottom border
        doc
          .moveTo(36, y + ROW_H - 3)
          .lineTo(560, y + ROW_H - 3)
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .stroke()
        doc.strokeColor('black').lineWidth(1)
      }
    }

    drawRow(TABLE_TOP, '#', 'Student Code', 'Full Name', 'Final Score', 'Classification', true)
    doc.fillColor('black')

    let rowY = TABLE_TOP + ROW_H + 2
    finalResults.forEach((r: any, i: number) => {
      // Auto page-break if needed
      if (rowY > doc.page.height - 60) {
        doc.addPage()
        rowY = 40
        drawRow(rowY, '#', 'Student Code', 'Full Name', 'Final Score', 'Classification', true)
        doc.fillColor('black')
        rowY += ROW_H + 2
      }
      drawRow(
        rowY,
        String(i + 1),
        r.studentCode ?? '-',
        r.fullName ?? '-',
        String(r.finalScore),
        r.classification
      )
      rowY += ROW_H
    })

    doc.moveDown(1.5).fontSize(8).fillColor('#888888').text(`Total students: ${finalResults.length}`, { align: 'right' })

    doc.end()
  }

  // ── CSV ────────────────────────────────────────────────────────────────────
  async exportCsv(classId: string): Promise<string> {
    const finalResults = await this.getFinalResults(classId)

    const header = ['Rank', 'Student Code', 'Full Name', 'Email', 'Final Score', 'Classification']
      .map(escapeCsvCell)
      .join(',')

    const rows = finalResults.map((r: any, i: number) =>
      [
        String(i + 1),
        r.studentCode ?? '',
        r.fullName ?? '',
        r.email ?? '',
        String(r.finalScore),
        r.classification
      ]
        .map(escapeCsvCell)
        .join(',')
    )

    // UTF-8 BOM is prepended in the controller so the CSV string itself stays clean
    return [header, ...rows].join('\r\n')
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Helper: get a class document for use in export filename resolution
  // ───────────────────────────────────────────────────────────────────────────
  async getClassMeta(classId: string) {
    return databaseService.classes.findOne(
      { _id: new ObjectId(classId) },
      { projection: { classCode: 1, subjectName: 1, semester: 1 } }
    )
  }
}

const reportService = new ReportService()
export default reportService
