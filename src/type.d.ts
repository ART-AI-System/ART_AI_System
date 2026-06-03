import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/users.schema'
import { TokenPayload } from '~/models/requests/users.request'

export type ReqBody<T> = Request<ParamsDictionary, any, T>

// Example usage in controller:
// export const loginController = async (req: ReqBody<LoginReqBody>, res: Response) => {}

declare module 'express' {
  export interface Request {
    user?: User
    decoded_auth?: TokenPayload
    decored_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    tweet?: any
  }
}

