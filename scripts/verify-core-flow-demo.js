const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const DEMO_KEY = 'core-submission-ai-grading-v1'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function verify() {
  const uri =
    process.env.MONGODB_URI ||
    `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME || 'art-ai-system-dev')
    const gradeItem = await db.collection('grade_items').findOne({ demoSeedKey: DEMO_KEY })
    assert(gradeItem, 'Demo grade item is missing')
    assert(gradeItem.aiInteractionRequired === true, 'Demo assignment must require AI declarations')
    assert(gradeItem.minAiInteractions === 5, 'Demo assignment must require five declarations')
    assert(Array.isArray(gradeItem.rubric) && gradeItem.rubric.length === 4, 'Demo assignment must have an academic rubric')
    assert(gradeItem.rubric.reduce((sum, item) => sum + item.maxPoints, 0) === gradeItem.maxScore, 'Rubric total must equal maxScore')

    const submissions = await db.collection('submissions').find({ demoSeedKey: DEMO_KEY }).toArray()
    assert(submissions.length === 6, `Expected 6 demo submissions, found ${submissions.length}`)

    let gradedCount = 0
    let advisoryWithoutGradeCount = 0
    for (const submission of submissions) {
      const [interactionCount, grade, evaluation] = await Promise.all([
        db.collection('ai_interactions').countDocuments({ submissionId: submission._id, demoSeedKey: DEMO_KEY }),
        db.collection('grades').findOne({ submissionId: submission._id }),
        db.collection('ai_evaluations').findOne({ submissionId: submission._id })
      ])
      assert(interactionCount === 5, `Submission ${submission._id} must have five AI declarations`)
      assert(evaluation, `Submission ${submission._id} is missing its AI transparency evaluation`)
      assert(fs.existsSync(path.join(process.cwd(), submission.fileStorageKey)), `Submission file is missing: ${submission.fileStorageKey}`)
      if (grade) gradedCount += 1
      const advisoryRun = await db.collection('ai_advisory_runs').findOne({ submissionId: submission._id })
      if (!grade && advisoryRun) advisoryWithoutGradeCount += 1
      if (grade) {
        assert(Array.isArray(grade.rubricScores) && grade.rubricScores.length === 4, 'Published demo grade must persist rubric scores')
      }
    }

    assert(gradedCount >= 3, 'Expected at least three lecturer-published demo grades')
    assert(
      advisoryWithoutGradeCount >= 1,
      'Expected at least one AI suggestion/audit that did not automatically become a final grade'
    )

    console.log(
      JSON.stringify(
        {
          database: db.databaseName,
          demoSubmissions: submissions.length,
          lecturerPublishedGrades: gradedCount,
          advisoryResultsWithoutFinalGrade: advisoryWithoutGradeCount,
          status: 'PASS'
        },
        null,
        2
      )
    )
  } finally {
    await client.close()
  }
}

verify().catch(error => {
  console.error(error.message)
  process.exit(1)
})
