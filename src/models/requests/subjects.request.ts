import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

export const createSubjectValidator = checkSchema(
  {
    code: {
      notEmpty: { errorMessage: 'Subject code is required' },
      isString: { errorMessage: 'Subject code must be a string' },
      trim: true
    },
    name: {
      notEmpty: { errorMessage: 'Subject name is required' },
      isString: { errorMessage: 'Subject name must be a string' },
      trim: true
    },
    description: {
      optional: true,
      isString: { errorMessage: 'Description must be a string' },
      trim: true
    },
    departmentId: {
      optional: true,
      custom: {
        options: (value) => {
          if (!ObjectId.isValid(value)) {
            throw new Error('Invalid department ID')
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const updateSubjectValidator = checkSchema(
  {
    code: {
      optional: true,
      isString: { errorMessage: 'Subject code must be a string' },
      trim: true
    },
    name: {
      optional: true,
      isString: { errorMessage: 'Subject name must be a string' },
      trim: true
    },
    description: {
      optional: true,
      isString: { errorMessage: 'Description must be a string' },
      trim: true
    },
    departmentId: {
      optional: true,
      custom: {
        options: (value) => {
          if (!ObjectId.isValid(value)) {
            throw new Error('Invalid department ID')
          }
          return true
        }
      }
    }
  },
  ['body']
)
