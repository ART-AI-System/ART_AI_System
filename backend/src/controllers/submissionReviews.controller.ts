import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { AddSubmissionCommentReqBody, UpdateReviewStatusReqBody } from '~/models/requests/submissionReviews.request'
import User from '~/models/schemas/users.schema'
import submissionReviewsService from '~/services/submissionReviews.service'

export const getSubmissionOverviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const user = req.user as User
    const lecturerId = (user._id as ObjectId).toString()
    const result = await submissionReviewsService.getSubmissionOverview(classId as string, lecturerId)

    res.json({
      message: 'Get submission overview successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const lecturerId = (user._id as ObjectId).toString()
    const result = await submissionReviewsService.getSubmissionReview(id as string, lecturerId)

    res.json({
      message: 'Get submission review successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const addSubmissionCommentController = async (
  req: Request<any, any, AddSubmissionCommentReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const lecturerId = (user._id as ObjectId).toString()
    const result = await submissionReviewsService.addComment(id as string, lecturerId, req.body)

    res.json({
      message: 'Add submission comment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateReviewStatusController = async (
  req: Request<any, any, UpdateReviewStatusReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const lecturerId = (user._id as ObjectId).toString()
    const result = await submissionReviewsService.updateReviewStatus(id as string, lecturerId, req.body)

    res.json({
      message: 'Update review status successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const createSubmissionReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const lecturerId = (user._id as ObjectId).toString()
    const result = await submissionReviewsService.createReview(id as string, lecturerId, req.body)

    res.json({
      message: 'Create submission review successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
