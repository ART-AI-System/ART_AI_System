import { checkSchema } from 'express-validator'


export const createSemesterValidator = checkSchema(
  {
    code: {
      notEmpty: { errorMessage: 'Semester code is required' },
      isString: { errorMessage: 'Semester code must be a string' },
      trim: true
    },
    name: {
      notEmpty: { errorMessage: 'Semester name is required' },
      isString: { errorMessage: 'Semester name must be a string' },
      trim: true
    },
    academicYear: {
      notEmpty: { errorMessage: 'Academic year is required' },
      isString: { errorMessage: 'Academic year must be a string' },
      trim: true
    },
    startDate: {
      notEmpty: { errorMessage: 'Start date is required' },
      isISO8601: { errorMessage: 'Start date must be ISO8601' },
      toDate: true
    },
    endDate: {
      notEmpty: { errorMessage: 'End date is required' },
      isISO8601: { errorMessage: 'End date must be ISO8601' },
      toDate: true
    },
    isCurrent: {
      optional: true,
      isBoolean: { errorMessage: 'isCurrent must be a boolean' }
    }
  },
  ['body']
)

export const updateSemesterValidator = checkSchema(
  {
    code: {
      optional: true,
      isString: { errorMessage: 'Semester code must be a string' },
      trim: true
    },
    name: {
      optional: true,
      isString: { errorMessage: 'Semester name must be a string' },
      trim: true
    },
    academicYear: {
      optional: true,
      isString: { errorMessage: 'Academic year must be a string' },
      trim: true
    },
    startDate: {
      optional: true,
      isISO8601: { errorMessage: 'Start date must be ISO8601' },
      toDate: true
    },
    endDate: {
      optional: true,
      isISO8601: { errorMessage: 'End date must be ISO8601' },
      toDate: true
    }
  },
  ['body']
)
