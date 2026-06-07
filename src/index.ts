import express from 'express'
import usersRouter from '~/routes/users.routes'
import authRouter from '~/routes/auth.routes'
import databaseService from '~/services/database.service'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
import { config } from 'dotenv'
config()

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
})

const app = express()
const port = 4000

app.use(express.json())

app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
