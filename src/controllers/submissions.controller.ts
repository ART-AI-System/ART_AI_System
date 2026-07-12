import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { UploadedSubmissionFile } from '~/models/requests/submissions.request'
import User from '~/models/schemas/users.schema'
import submissionsService from '~/services/submissions.service'

export const createSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gradeItemId, assignmentId } = req.params
    const targetGradeItemId = (gradeItemId || assignmentId) as string
    const user = req.user as User
    const submissionFile = req.submissionFile as UploadedSubmissionFile | undefined

    if (!submissionFile) {
      throw new ErrorWithStatus({
        message: 'Submission file is required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await submissionsService.createSubmission(
      targetGradeItemId,
      user._id!.toString(),
      submissionFile,
      req.body.note
    )

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
    const { gradeItemId, assignmentId } = req.params
    const targetGradeItemId = (gradeItemId || assignmentId) as string
    const user = req.user as User
    const result = await submissionsService.getMySubmissionByGradeItem(targetGradeItemId, user._id!.toString())

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
    const { gradeItemId, assignmentId } = req.params
    const targetGradeItemId = (gradeItemId || assignmentId) as string
    const user = req.user as User
    const isHistoryRequest = req.query.history === 'true' || req.query.includeHistory === 'true'
    const result = isHistoryRequest
      ? await submissionsService.getSubmissionHistoryByGradeItem(targetGradeItemId, user)
      : await submissionsService.getSubmissionsByGradeItem(targetGradeItemId, user)

    res.json({
      message: isHistoryRequest ? 'Get submission history successfully' : 'Get submissions successfully',
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
    const downloadFile = await submissionsService.getSubmissionDownloadFile(id as string, user, {
      path: req.query.path as string | undefined
    })

    if ('buffer' in downloadFile) {
      res.setHeader('Content-Type', downloadFile.mimeType)
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFile.fileName.replace(/"/g, '')}"`)
      res.send(downloadFile.buffer)
      return
    }

    res.download(downloadFile.filePath, downloadFile.fileName)
  } catch (error) {
    next(error)
  }
}

export const getSubmissionFileTreeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionFileTree(submissionId as string, user)

    res.json({
      message: 'Get submission file tree successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionFileContentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionFileContent(submissionId as string, user, {
      path: req.query.path as string | undefined
    })

    res.json({
      message: 'Get submission file content successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionVersionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionVersions(submissionId as string, user)

    res.json({
      message: 'Get submission versions successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const resubmitSubmissionVersionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params
    const user = req.user as User
    const submissionFile = req.submissionFile as UploadedSubmissionFile | undefined

    if (!submissionFile) {
      throw new ErrorWithStatus({
        message: 'Submission file is required',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await submissionsService.resubmitSubmissionVersion(
      submissionId as string,
      user._id!.toString(),
      submissionFile,
      req.body.note
    )

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Create submission version successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const getSubmissionVersionByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { versionId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionVersionById(versionId as string, user)

    res.json({
      message: 'Get submission version successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const downloadSubmissionVersionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { versionId } = req.params
    const user = req.user as User
    const submission = await submissionsService.getSubmissionVersionById(versionId as string, user)
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

export const getSubmissionHeatmapController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const user = req.user as User
    const result = await submissionsService.getSubmissionHeatmap(studentId as string, user, {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      semesterId: req.query.semesterId as string | undefined
    })

    res.json({
      message: 'Get submission heatmap successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const finalizeSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await submissionsService.finalizeSubmission(id as string, user._id!.toString())

    res.json({
      message: 'Finalize submission successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}

export const withdrawSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = req.user as User
    const result = await submissionsService.withdrawSubmission(id as string, user)

    res.json({
      message: 'Withdraw submission successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
