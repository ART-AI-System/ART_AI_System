import { QuestionType } from '~/models/schemas/tests.schema'

export interface CreateTestReqBody {
  title: string
  duration: number
  totalPoints: number
  showResultImmediately: boolean
  questions: {
    type: QuestionType
    text: string
    points: number
    options: {
      text: string
      isCorrect: boolean
    }[]
  }[]
}

export interface SubmitTestReqBody {
  answers: {
    questionId: string
    selectedOptionIds: string[]
  }[]
}
