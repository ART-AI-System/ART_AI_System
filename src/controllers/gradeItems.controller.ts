import { Request, Response, NextFunction } from 'express'
import gradeItemsService from '~/services/gradeItems.service'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

export const createGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const result = await gradeItemsService.createGradeItem(classId as string, req.body)
    res.status(201).json({
      message: 'Create grade item successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getGradeItemsByClassController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params
    const result = await gradeItemsService.getGradeItemsByClassId(classId as string)
    res.json({
      message: 'Get grade items successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getGradeItemByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await gradeItemsService.getGradeItemById(id as string)
    if (!result) {
      res.status(404).json({ message: 'Grade item not found' })
      return
    }
    res.json({
      message: 'Get grade item successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const updateGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await gradeItemsService.updateGradeItem(id as string, req.body)
    if (!result) {
      res.status(404).json({ message: 'Grade item not found' })
      return
    }
    res.json({
      message: 'Update grade item successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteGradeItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await gradeItemsService.deleteGradeItem(id as string)
    if (!result) {
      res.status(404).json({ message: 'Grade item not found' })
      return
    }
    res.json({
      message: 'Delete grade item successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const listGradeItemMaterialsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gradeItemsService.listMaterials(req.params.id as string, req.user)
    res.json({
      message: 'Get grade item materials successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const uploadGradeItemMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materialFile = req.assignmentMaterialFile as UploadedAssignmentMaterialFile | undefined
    const result = await gradeItemsService.uploadMaterial(
      req.params.id as string,
      materialFile as UploadedAssignmentMaterialFile,
      req.body,
      req.user
    )
    res.status(201).json({
      message: 'Upload grade item material successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const downloadGradeItemMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await gradeItemsService.getMaterialForDownload(req.params.materialId as string, req.user)
    res.download(material.filepath, material.originalFilename)
  } catch (error) {
    next(error)
  }
}

export const deleteGradeItemMaterialController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gradeItemsService.deleteMaterial(req.params.materialId as string, req.user)
    res.json({
      message: 'Delete grade item material successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
