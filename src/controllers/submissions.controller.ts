import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedSubmissionFile } from '~/models/requests/submissions.request'
import User from '~/models/schemas/users.schema'
import submissionsService from '~/services/submissions.service'

export const createSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeItemId } = req.params
    const user = req.user as User
    const submissionFile = req.submissionFile as UploadedSubmissionFile | undefined

    if (!submissionFile) {
      throw new ErrorWithStatus({
        message: 'Submission file is required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await submissionsService.createSubmission(gradeItemId as string, user._id!.toString(), submissionFile)

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Submit assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getMySubmissionByGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeItemId } = req.params
    const user = req.user as User
    const result = await submissionsService.getMySubmissionByGradeItem(gradeItemId as string, user._id!.toString())

    if (!result) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Submission not found' })
      return
    }

    res.json({
      message: 'Get my submission successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionsByGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeItemId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionsByGradeItem(gradeItemId as string, user._id!.toString())

    res.json({
      message: 'Get submissions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionById(id as string, user)

    res.json({
      message: 'Get submission successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const downloadSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const submission = await submissionsService.getSubmissionById(id as string, user)
    const filePath = submissionsService.getSubmissionFilePath(submission)

    if (!fs.existsSync(filePath)) {
      throw new ErrorWithStatus({
        message: 'Submission file not found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    res.download(filePath, submission.fileName)
  } catch (error) {
    next(error)
  }
}

export const getMySubmissionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const result = await submissionsService.getMySubmissions(user._id!.toString())

    res.json({
      message: 'Get my submissions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
