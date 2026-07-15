export interface UploadedSubmissionFile {
  originalFilename: string
  filepath: string
  mimetype: string
  size: number
  contentHash: string
}

export interface SubmissionUploadFields {
  note?: string
  groupMembers?: string
}
