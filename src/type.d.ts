import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/users.schema'
import { TokenPayload } from '~/models/requests/users.request'
import { UploadedSubmissionFile } from '~/models/requests/submissions.request'
import { UploadedAssignmentMaterialFile } from '~/models/requests/assignments.request'

export type ReqBody<T> = Request<ParamsDictionary, any, T>

// Example usage in controller:
// export const loginController = async (req: ReqBody<LoginReqBody>, res: Response) => {}

declare module 'express' {
  export interface Request {
    user?: User
    decoded_auth?: TokenPayload
    decored_refresh_token?: TokenPayload  // typo giữ lại để backward compat
    decoded_forgot_password_token?: TokenPayload
    submissionFile?: UploadedSubmissionFile
    assignmentMaterialFile?: UploadedAssignmentMaterialFile
  }
}
