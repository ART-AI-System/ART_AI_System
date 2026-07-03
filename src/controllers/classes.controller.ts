import { Request, Response, NextFunction } from 'express'
import classesService from '~/services/classes.service'

export const createClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await classesService.createClass(req.body)
    res.status(201).json({
      message: 'Create class successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getClassesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await classesService.getClasses()
    res.json({
      message: 'Get classes successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getClassByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await classesService.getClassById(id as string)
    if (!result) {
      res.status(404).json({ message: 'Class not found' })
      return
    }
    res.json({
      message: 'Get class successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await classesService.updateClass(id as string, req.body)
    if (!result) {
      res.status(404).json({ message: 'Class not found' })
      return
    }
    res.json({
      message: 'Update class successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await classesService.deleteClass(id as string)
    if (!result) {
      res.status(404).json({ message: 'Class not found' })
      return
    }
    res.json({
      message: 'Delete class successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const importStudentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const rows = (req as any).importRows as Record<string, string>[]
    if (!rows || rows.length === 0) {
      res.status(400).json({ message: 'No rows found to import' })
      return
    }
    const result = await classesService.importStudents(id as string, rows)
    res.json({
      message: 'Import students successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const addStudentToClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { studentId } = req.body
    if (!studentId) {
      res.status(400).json({ message: 'studentId is required' })
      return
    }
    const result = await classesService.addStudentToClass(id as string, studentId as string)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const removeStudentFromClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, studentId } = req.params
    if (!studentId) {
      res.status(400).json({ message: 'studentId is required' })
      return
    }
    const result = await classesService.removeStudentFromClass(id as string, studentId as string)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
