import { Request, Response, NextFunction } from 'express'
import User from '~/models/schemas/users.schema'
import aiDeclarationService from '~/services/aiDeclaration.services'
import HTTP_STATUS from '~/constants/httpStatus'

export const createAiInteractionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.createAiInteraction(
      submissionId as string,
      user._id!.toString(),
      req.body
    )
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Create AI interaction successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listAiInteractionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.listAiInteractions(
      submissionId as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Get AI interactions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getAiInteractionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.getAiInteraction(
      id as string,
      user._id!.toString(),
      user.role
    )
    res.json({
      message: 'Get AI interaction detail successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateAiInteractionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.updateAiInteraction(
      id as string,
      user._id!.toString(),
      req.body
    )
    res.json({
      message: 'Update AI interaction successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAiInteractionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.deleteAiInteraction(
      id as string,
      user._id!.toString()
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const validateAiInteractionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await aiDeclarationService.validateRequirements(
      submissionId as string,
      user._id!.toString()
    )
    res.json({
      message: 'Validate AI interactions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
