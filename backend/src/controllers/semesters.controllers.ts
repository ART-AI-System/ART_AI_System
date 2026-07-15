import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { SemesterType } from '~/models/schemas/semesters.schema'
import semestersService from '~/services/semesters.service'

export const createSemesterController = async (req: Request, res: Response) => {
  const result = await semestersService.createSemester(req.body as SemesterType)
  res.status(HTTP_STATUS.CREATED).json({
    message: 'Create semester successfully',
    result
  })
}

export const getSemestersController = async (req: Request, res: Response) => {
  const result = await semestersService.getSemesters()
  res.json({
    message: 'Get semesters successfully',
    result
  })
}

export const getCurrentSemesterController = async (req: Request, res: Response) => {
  const result = await semestersService.getCurrentSemester()
  res.json({
    message: 'Get current semester successfully',
    result
  })
}

export const getSemesterByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await semestersService.getSemesterById(id as string)
  res.json({
    message: 'Get semester successfully',
    result
  })
}

export const updateSemesterController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await semestersService.updateSemester(id as string, req.body)
  res.json({
    message: 'Update semester successfully',
    result
  })
}

export const setCurrentSemesterController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await semestersService.setCurrentSemester(id as string)
  res.json({
    message: 'Set current semester successfully',
    result
  })
}

export const toggleSemesterStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isActive } = req.body
  const result = await semestersService.toggleSemesterStatus(id as string, isActive)
  res.json({
    message: 'Toggle semester status successfully',
    result
  })
}
