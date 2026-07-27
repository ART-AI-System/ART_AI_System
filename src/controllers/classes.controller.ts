import { Request, Response, NextFunction } from 'express'
import classesService from '~/services/classes.service'
import databaseService from '~/services/database.service'
import { ObjectId } from 'mongodb'

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

export const importAndCreateClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classCode, subjectId, semesterId, lecturerId } = req.body
    const rows = (req as any).importRows as Record<string, string>[]
    
    if (!classCode || !subjectId || !semesterId || !lecturerId) {
      res.status(400).json({ message: 'Missing required class fields (classCode, subjectId, semesterId, lecturerId)' })
      return
    }
    
    if (!rows || rows.length === 0) {
      res.status(400).json({ message: 'No rows found to import in the uploaded file' })
      return
    }
    
    // Fetch subject and lecturer to build snapshots
    const subject = await databaseService.subjects.findOne({ _id: new ObjectId(subjectId as string) })
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' })
      return
    }
    
    const lecturer = await databaseService.users.findOne({ _id: new ObjectId(lecturerId as string) })
    if (!lecturer) {
      res.status(404).json({ message: 'Lecturer not found' })
      return
    }
    
    // 1. Create the class
    const newClass = await classesService.createClass({
      classCode: classCode as string,
      semesterId: semesterId as string,
      subjectId: subjectId as string,
      subjectSnapshot: {
        subjectId: subject._id,
        code: subject.code,
        name: subject.name
      },
      lecturer: {
        lecturerId: lecturer._id,
        fullName: lecturer.fullName,
        email: lecturer.email
      }
    } as any)
    
    // 2. Import students into the newly created class
    const importResult = await classesService.importStudents(newClass._id.toString(), rows)
    
    res.json({
      message: 'Class created and students imported successfully',
      result: {
        class: newClass,
        importResult
      }
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

export const promoteCohortController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { targetSemesterId, assignments } = req.body
    
    if (!targetSemesterId || !assignments || !Array.isArray(assignments) || assignments.length === 0) {
      res.status(400).json({ message: 'targetSemesterId and assignments array are required' })
      return
    }
    
    const result = await classesService.promoteCohort(id as string, targetSemesterId, assignments)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
