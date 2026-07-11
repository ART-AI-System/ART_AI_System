import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { SubjectType } from '~/models/schemas/subjects.schema'
import subjectsService from '~/services/subjects.service'

export const createSubjectController = async (req: Request, res: Response) => {
  const result = await subjectsService.createSubject(req.body as SubjectType)
  res.status(HTTP_STATUS.CREATED).json({
    message: 'Create subject successfully',
    result
  })
}

export const getSubjectsController = async (req: Request, res: Response) => {
  const result = await subjectsService.getSubjects()
  res.json({
    message: 'Get subjects successfully',
    result
  })
}

export const getSubjectByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await subjectsService.getSubjectById(id as string)
  res.json({
    message: 'Get subject successfully',
    result
  })
}

export const updateSubjectController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await subjectsService.updateSubject(id as string, req.body)
  res.json({
    message: 'Update subject successfully',
    result
  })
}

export const toggleSubjectStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isActive } = req.body
  const result = await subjectsService.toggleSubjectStatus(id as string, isActive)
  res.json({
    message: 'Toggle subject status successfully',
    result
  })
}
