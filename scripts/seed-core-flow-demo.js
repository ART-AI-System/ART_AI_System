const { MongoClient, ObjectId } = require('mongodb')
const { randomUUID, createHash } = require('crypto')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const DEMO_KEY = 'core-submission-ai-grading-v1'

function asObjectId(value) {
  return value instanceof ObjectId ? value : new ObjectId(value)
}

function buildSource(studentCode, variant) {
  return `// ART-AI demo submission for ${studentCode}
class SubmissionAnalytics {
  constructor(records = []) {
    this.records = records;
  }

  summarize() {
    const submitted = this.records.filter(record => record.status === 'submitted').length;
    const aiAssisted = this.records.filter(record => record.usedAI).length;
    return {
      total: this.records.length,
      submitted,
      aiUsageRate: this.records.length ? aiAssisted / this.records.length : 0,
      variant: ${variant}
    };
  }
}

module.exports = SubmissionAnalytics;
`
}

async function seed() {
  const uri =
    process.env.MONGODB_URI ||
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME || 'art-ai-system-dev')

    const lecturer = await db.collection('users').findOne({ username: 'lecturer01', role: 'LECTURER' })
    if (!lecturer) throw new Error('lecturer01 was not found in Atlas')

    const classData = await db.collection('classes').findOne({
      classCode: 'SE18D02',
      $or: [
        { lecturerId: lecturer._id },
        { lecturerId: lecturer._id.toString() },
        { 'lecturer.lecturerId': lecturer._id },
        { 'lecturer.lecturerId': lecturer._id.toString() }
      ]
    })
    if (!classData) throw new Error('SE18D02 assigned to lecturer01 was not found in Atlas')

    const session = await db.collection('sessions').findOne({ classId: classData._id })
    const studentIds = (classData.studentIds || classData.students?.map(student => student.studentId) || [])
      .slice(0, 6)
      .map(asObjectId)
    const students = await db
      .collection('users')
      .find({ _id: { $in: studentIds }, role: 'STUDENT' })
      .sort({ studentCode: 1 })
      .toArray()
    if (students.length < 3) throw new Error('Not enough students were found in SE18D02')

    const now = new Date()
    const deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    const gradeItemResult = await db.collection('grade_items').findOneAndUpdate(
      { demoSeedKey: DEMO_KEY },
      {
        $set: {
          classId: classData._id,
          sessionId: session?._id,
          title: 'Core Flow Demo - AI-assisted Submission',
          description: 'Implement a SubmissionAnalytics module. summarize() must return total records, submitted-record count, AI-usage rate (0 for an empty list), and the supplied variant. The code must handle invalid input safely and include evidence of tests or usage documentation.',
          weight: 0,
          maxScore: 10,
          deadline,
          aiInteractionRequired: true,
          minAiInteractions: 5,
          maxAiInteractions: 10,
          aiDeclarationConfig: [
            { categoryId: 'decomposition', weight: 20 },
            { categoryId: 'pattern_recognition', weight: 15 },
            { categoryId: 'abstraction', weight: 15 },
            { categoryId: 'algorithmic_thinking', weight: 20 },
            { categoryId: 'reflection', weight: 30 }
          ],
          rubric: [
            {
              id: 'functional-requirements',
              name: 'Functional requirements',
              description: 'Implements every output required by summarize() and follows the supplied module contract.',
              maxPoints: 4,
              evidenceRequirements: ['Point to the implementation of every required output field.']
            },
            {
              id: 'correctness-edge-cases',
              name: 'Correctness and edge cases',
              description: 'Calculations are correct and empty or invalid input is handled safely.',
              maxPoints: 3,
              evidenceRequirements: ['Show empty-list handling and input validation.']
            },
            {
              id: 'code-quality',
              name: 'Code quality and maintainability',
              description: 'Code is readable, cohesive and appropriately structured.',
              maxPoints: 2,
              evidenceRequirements: ['Cite concrete structure or naming evidence.']
            },
            {
              id: 'tests-documentation',
              name: 'Tests and usage documentation',
              description: 'Provides tests or clear usage documentation for the required behavior.',
              maxPoints: 1,
              evidenceRequirements: ['Cite a test file, assertions, README, or usage example.']
            }
          ],
          sequenceOrder: 99,
          isActive: true,
          isGroupAssignment: false,
          demoSeedKey: DEMO_KEY,
          updatedAt: now
        },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true, returnDocument: 'after' }
    )
    const gradeItem = gradeItemResult

    const uploadDir = path.join(process.cwd(), 'uploads', 'submissions')
    fs.mkdirSync(uploadDir, { recursive: true })

    const purposes = ['decomposition', 'pattern_recognition', 'abstraction', 'algorithmic_thinking', 'reflection']
    const seededSubmissions = []

    for (let index = 0; index < students.length; index += 1) {
      const student = students[index]
      const studentCode = student.studentCode || student.username
      const source = buildSource(studentCode, index + 1)
      const fileName = `core-flow-demo-${studentCode}.js`
      const storageKey = path.join('uploads', 'submissions', fileName)
      fs.writeFileSync(path.join(process.cwd(), storageKey), source, 'utf8')

      const demoStatuses = ['graded', 'submitted', 'late', 'graded', 'submitted', 'graded']
      const status = demoStatuses[index] || 'submitted'
      const submittedAt = new Date(now.getTime() - (index + 1) * 60 * 60 * 1000)
      const submission = await db.collection('submissions').findOneAndUpdate(
        { demoSeedKey: DEMO_KEY, gradeItemId: gradeItem._id, studentId: student._id },
        {
          $set: {
            uuid: randomUUID(),
            gradeItemId: gradeItem._id,
            classId: classData._id,
            studentId: student._id,
            versionNumber: 1,
            fileName,
            fileStorageKey: storageKey,
            fileSize: Buffer.byteLength(source),
            mimeType: 'text/javascript',
            contentHash: createHash('sha256').update(source).digest('hex'),
            note: 'Seeded from the existing Atlas lecturer/class/student ecosystem.',
            groupMembers: [],
            status,
            submittedAt,
            finalizedAt: submittedAt,
            aiRequirementSatisfied: true,
            aiInteractionCount: purposes.length,
            isLatest: true,
            demoSeedKey: DEMO_KEY,
            updatedAt: now
          },
          $setOnInsert: { createdAt: submittedAt }
        },
        { upsert: true, returnDocument: 'after' }
      )
      seededSubmissions.push(submission)

      for (let purposeIndex = 0; purposeIndex < purposes.length; purposeIndex += 1) {
        const purpose = purposes[purposeIndex]
        await db.collection('ai_interactions').updateOne(
          { demoSeedKey: DEMO_KEY, submissionId: submission._id, usagePurpose: purpose },
          {
            $set: {
              submissionId: submission._id,
              gradeItemId: gradeItem._id,
              studentId: student._id,
              aiTool: purposeIndex % 2 === 0 ? 'chatgpt' : 'gemini',
              usagePurpose: purpose,
              promptContent: `Suggest an approach for ${purpose.replace('_', ' ')} in my submission analytics module.`,
              aiResponseSummary: 'The AI suggested separating data filtering, aggregation, and presentation concerns.',
              studentDecision: purposeIndex === 1 ? 'partially_accepted' : 'reference_only',
              reflectionText: 'I reviewed the suggestion, kept the separation of concerns, and rewrote the implementation to match my own data model.',
              isValidForSubmission: true,
              demoSeedKey: DEMO_KEY,
              updatedAt: now
            },
            $setOnInsert: { createdAt: submittedAt }
          },
          { upsert: true }
        )
      }

      const dependencyScore = [18, 42, 72, 28, 55, 82][index] || 35
      const riskLevel = dependencyScore > 60 ? 'high' : dependencyScore > 25 ? 'medium' : 'low'
      await db.collection('ai_evaluations').updateOne(
        { submissionId: submission._id },
        {
          $set: {
            submissionId: submission._id,
            gradeItemId: gradeItem._id,
            studentId: student._id,
            classId: classData._id,
            pattern: dependencyScore > 60 ? 'high_dependency' : dependencyScore > 25 ? 'collaborative_usage' : 'critical_engagement',
            riskLevel,
            transparencyScore: 100 - Math.round(dependencyScore / 3),
            promptQualityScore: 78 + index,
            reflectionQualityScore: 82 - index,
            criticalThinkingScore: 80 - index * 2,
            aiDependencyScore: dependencyScore,
            summary: 'Demo heuristic evaluation based on five structured AI declarations.',
            evaluatedAt: submittedAt,
            demoSeedKey: DEMO_KEY,
            updatedAt: now
          },
          $setOnInsert: { createdAt: submittedAt }
        },
        { upsert: true }
      )

      if (index === 1) {
        const demoSuggestion = {
          summary: 'Demo rubric-grounded advisory fixture for the SubmissionAnalytics module.',
          suggestedScore: 7.2,
          maxScore: 10,
          rubricBreakdown: [
            { criterionId: 'functional-requirements', criteriaName: 'Functional requirements', score: 3.5, maxScore: 4, comment: 'The required summary fields are implemented.', evidence: [{ filePath: fileName, location: 'summarize()', explanation: 'Returns total, submitted, aiUsageRate and variant.' }], confidence: 95, missingEvidence: [] },
            { criterionId: 'correctness-edge-cases', criteriaName: 'Correctness and edge cases', score: 2.5, maxScore: 3, comment: 'Empty-list division is handled, but constructor input is not validated.', evidence: [{ filePath: fileName, location: 'summarize()', explanation: 'Uses a zero fallback when records is empty.' }], confidence: 90, missingEvidence: ['Invalid constructor input validation'] },
            { criterionId: 'code-quality', criteriaName: 'Code quality and maintainability', score: 1.2, maxScore: 2, comment: 'The class is concise but has no explicit types or contract documentation.', evidence: [{ filePath: fileName, location: 'SubmissionAnalytics', explanation: 'Small cohesive class with descriptive names.' }], confidence: 85, missingEvidence: ['Type or API contract'] },
            { criterionId: 'tests-documentation', criteriaName: 'Tests and usage documentation', score: 0, maxScore: 1, comment: 'No tests or usage documentation are included.', evidence: [], confidence: 100, missingEvidence: ['Tests or usage documentation'] }
          ],
          suggestedFeedback: 'The core summary behavior is present. Add invalid-input handling plus tests or usage documentation before full credit.'
        }
        await db.collection('ai_advisory_runs').updateOne(
          { demoSeedKey: DEMO_KEY, submissionId: submission._id, type: 'aiGradingSuggestion' },
          {
            $set: {
              submissionId: submission._id,
              gradeItemId: gradeItem._id,
              studentId: student._id,
              classId: classData._id,
              type: 'aiGradingSuggestion',
              result: demoSuggestion,
              submissionContentHash: submission.contentHash,
              provider: 'demo-fixture',
              model: 'none',
              promptVersion: 'rubric-grounded-v2-demo',
              generatedBy: lecturer._id,
              demoSeedKey: DEMO_KEY,
              createdAt: now
            }
          },
          { upsert: true }
        )
      }

      if (status === 'graded') {
        const score = [8.6, 7.8, 6.9, 8.1, 7.4, 6.5][index] || 7.5
        const rubricScores = [
          { criterionId: 'functional-requirements', name: 'Functional requirements', score: Number((score * 0.4).toFixed(2)), maxPoints: 4 },
          { criterionId: 'correctness-edge-cases', name: 'Correctness and edge cases', score: Number((score * 0.3).toFixed(2)), maxPoints: 3 },
          { criterionId: 'code-quality', name: 'Code quality and maintainability', score: Number((score * 0.2).toFixed(2)), maxPoints: 2 },
          { criterionId: 'tests-documentation', name: 'Tests and usage documentation', score: Number((score * 0.1).toFixed(2)), maxPoints: 1 }
        ]
        await db.collection('grades').updateOne(
          { submissionId: submission._id, studentId: student._id },
          {
            $set: {
              submissionId: submission._id,
              studentId: student._id,
              classId: classData._id,
              gradeItemId: gradeItem._id,
              score,
              maxScore: 10,
              feedback: 'Lecturer reviewed the AI suggestion and published this score manually.',
              rubricScores,
              lecturerAdjustmentReason: 'Demo lecturer decision fixture.',
              publishedAt: now,
              gradedBy: lecturer._id,
              demoSeedKey: DEMO_KEY,
              updatedAt: now
            },
            $setOnInsert: { createdAt: now }
          },
          { upsert: true }
        )
      } else {
        await db.collection('grades').deleteMany({ submissionId: submission._id, demoSeedKey: DEMO_KEY })
      }
    }

    console.log(
      JSON.stringify(
        {
          database: db.databaseName,
          demoKey: DEMO_KEY,
          lecturer: lecturer.username,
          classCode: classData.classCode,
          gradeItemId: gradeItem._id,
          submissions: seededSubmissions.length,
          note: 'Existing non-demo records were not deleted or overwritten.'
        },
        null,
        2
      )
    )
  } finally {
    await client.close()
  }
}

seed().catch(error => {
  console.error(error.message)
  process.exit(1)
})
