import { NextFunction, Request, Response } from 'express'
import assignmentsService from '~/services/assignments.service'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

export const createAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.createAssignment(req.params.sessionId as string, req.body, req.user)
    res.status(201).json({
      message: 'Create assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listClassAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.listAssignmentsByClass(req.params.classId as string, req.user)
    res.json({
      message: 'Get class assignments successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listSessionAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.listAssignmentsBySession(req.params.sessionId as string, req.user)
    res.json({
      message: 'Get session assignments successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.getAssignmentById(req.params.id as string, req.user)
    res.json({
      message: 'Get assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.updateAssignment(req.params.id as string, req.body, req.user)
    res.json({
      message: 'Update assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.deleteAssignment(req.params.id as string, req.user)
    res.json({
      message: 'Delete assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const publishAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.publishAssignment(req.params.id as string, req.user)
    res.json({
      message: 'Publish assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const closeAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.closeAssignment(req.params.id as string, req.user)
    res.json({
      message: 'Close assignment successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listAssignmentMaterialsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.listMaterials(req.params.assignmentId as string, req.user)
    res.json({
      message: 'Get assignment materials successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const uploadAssignmentMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materialFile = req.assignmentMaterialFile as UploadedAssignmentMaterialFile | undefined
    const result = await assignmentsService.uploadMaterial(
      req.params.assignmentId as string,
      materialFile as UploadedAssignmentMaterialFile,
      req.body,
      req.user
    )
    res.status(201).json({
      message: 'Upload assignment material successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const downloadAssignmentMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await assignmentsService.getMaterialForDownload(req.params.id as string, req.user)
    res.download(material.filepath, material.originalFilename)
  } catch (error) {
    next(error)
  }
}

export const deleteAssignmentMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await assignmentsService.deleteMaterial(req.params.id as string, req.user)
    res.json({
      message: 'Delete assignment material successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
