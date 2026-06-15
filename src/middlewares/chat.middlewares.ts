import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ObjectId } from 'mongodb'

export const createRoomValidator = validate(
  checkSchema(
    {
      memberIds: {
        isArray: true,
        notEmpty: true,
        errorMessage: 'memberIds must be a non-empty array',
        custom: {
          options: (value: string[]) => {
            if (!value.every((id) => ObjectId.isValid(id))) {
              throw new Error('All memberIds must be valid ObjectId')
            }
            return true
          }
        }
      },
      type: {
        optional: true,
        isIn: {
          options: [['direct', 'group']],
          errorMessage: 'type must be direct or group'
        }
      }
    },
    ['body']
  )
)

export const sendMessageValidator = validate(
  checkSchema(
    {
      content: {
        notEmpty: true,
        isString: true,
        errorMessage: 'Content is required and must be a string'
      },
      messageType: {
        optional: true,
        isIn: {
          options: [['text', 'image', 'file']],
          errorMessage: 'messageType must be text, image, or file'
        }
      }
    },
    ['body']
  )
)
