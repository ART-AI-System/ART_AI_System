import express from 'express'
import { createServer } from 'http'
import { initChatSocket } from '~/socket/chat.socket'
import usersRouter from '~/routes/users.routes'
import authRouter from '~/routes/auth.routes'
import classesRouter from '~/routes/classes.routes'
import gradeItemsRouter from '~/routes/gradeItems.routes'
import gradesRouter, { gradesStandaloneRouter } from '~/routes/grades.routes'
import assignmentsRouter from '~/routes/assignments.routes'
import submissionsRouter from '~/routes/submissions.routes'
import submissionReviewsRouter from '~/routes/submissionReviews.routes'
import reportRouter from '~/routes/report.routes'
import finalResultRouter from '~/routes/finalResult.routes'
import studentRouter from '~/routes/student.routes'
import lecturerRouter from '~/routes/lecturer.routes'
import subjectHeadRouter from '~/routes/subjectHead.routes'
import adminRouter from '~/routes/admin.routes'
import chatRouter from '~/routes/chat.routes'
import aiDeclarationRouter from '~/routes/aiDeclaration.routes'
import aiEvaluationRouter from '~/routes/aiEvaluation.routes'
import notificationsRouter from '~/routes/notifications.routes'
import databaseService from '~/services/database.service'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
import { config } from 'dotenv'
config()

databaseService.connect().then(async () => {
  await databaseService.initCollections()
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexPasswordResetTokens()
  databaseService.indexSubmissions()
  databaseService.indexSubmissionReviews()
  databaseService.indexNotifications()
  databaseService.indexEmailLogs()
  databaseService.indexAssignments()
  databaseService.indexChatRooms()
  databaseService.indexChatMessages()
})

const app = express()
const port = 4000

app.use(express.json())

app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)
app.use('/api/classes', classesRouter)
app.use('/api/classes/:classId/grade-items', gradeItemsRouter)
app.use('/api/grade-items', gradeItemsRouter)
app.use('/api', assignmentsRouter)
app.use('/api/submissions/:id/grade', gradesRouter)
app.use('/api', gradesStandaloneRouter)
app.use('/api', submissionsRouter)
app.use('/api', submissionReviewsRouter)
app.use('/api', finalResultRouter)
app.use('/api', aiDeclarationRouter)
app.use('/api', aiEvaluationRouter)
app.use('/api', notificationsRouter)

app.use('/api/reports', reportRouter)

app.use('/api/student', studentRouter)
app.use('/api/lecturer', lecturerRouter)
app.use('/api/subject-head', subjectHeadRouter)
app.use('/api/admin', adminRouter)
app.use('/api/chat', chatRouter)

app.use(defaultErrorHandler)

const httpServer = createServer(app)
initChatSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
