export interface CreateAssignmentReqBody {
  title: string
  description?: string
  instructions?: string
  deadline: string
  maxScore?: number
  weight?: number
  aiDeclarationRequired?: boolean
  minAiInteractions?: number
  maxAiInteractions?: number
  allowResubmission?: boolean
  isGroupAssignment?: boolean
}

export type UpdateAssignmentReqBody = Partial<CreateAssignmentReqBody>

export interface UploadedAssignmentMaterialFile {
  originalFilename: string
  filepath: string
  mimetype: string
  size: number
  contentHash: string
}
