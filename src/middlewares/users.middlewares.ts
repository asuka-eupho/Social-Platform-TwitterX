import { error } from 'console'
import { verify } from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_VALID_MESSAGES } from '~/constants/messages'
import { ErrorStatus } from '~/models/errors'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidator = validate(checkSchema({
  email: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.EMAIL_REQUIRED
    },
    isEmail: {
      errorMessage: USER_VALID_MESSAGES.EMAIL_VALID
    },
    trim: true,
    custom: {
      options: async (value, { req }) => {
        const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })
        if (user === null) {
          throw new Error(USER_VALID_MESSAGES.USER_NOT_FOUND)
        }
        req.user = user
        return true
      }
    }
  },
  password: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_REQUIRED
    },
    isString: true,
    isLength: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_LENGTH,
      options: {
        min: 6,
        max: 100
      }
    },
    isStrongPassword: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_STRONG,
      options: {
        minLength: 6,
        minNumbers: 1,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }
    }
  },
}, ['body']))
export const registerValidator = validate(checkSchema({
  name: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.NAME_REQUIRED
    },
    isString: {
      errorMessage: USER_VALID_MESSAGES.NAME_IS_STRING
    },
    isLength: {
      errorMessage: USER_VALID_MESSAGES.NAME_LENGTH,
      options: {
        min: 1,
        max: 100
      }
    },
    trim: true
  },
  email: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.EMAIL_REQUIRED
    },
    isEmail: {
      errorMessage: USER_VALID_MESSAGES.EMAIL_VALID
    },
    trim: true,
    custom: {
      options: async (value) => {
        const isExist = await userService.checkEmailExist(value)
        if (isExist) {
          throw new Error('Email has already existed')
        }
        return true
      }
    }
  },
  password: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_REQUIRED
    },
    isString: true,
    isLength: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_LENGTH,
      options: {
        min: 6,
        max: 100
      }
    },
    isStrongPassword: {
      errorMessage: USER_VALID_MESSAGES.PASSWORD_STRONG,
      options: {
        minLength: 6,
        minNumbers: 1,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }
    }
  },
  confirm_password: {
    notEmpty: {
      errorMessage: USER_VALID_MESSAGES.CONFIRM_PASSWORD_REQUIRED
    },
    isString: true,
    isLength: {
      errorMessage: USER_VALID_MESSAGES.CONFIRM_PASSWORD_LENGTH,
      options: {
        min: 6,
        max: 100
      }
    },
    custom: {
      options: (value, { req }) => {
        if (value != req.body.password) {
          throw new Error(USER_VALID_MESSAGES.PASSWORD_MATCHING)
        }
        return true
      }
    }
  },
  date_of_birth: {
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true
      },
      errorMessage: USER_VALID_MESSAGES.DATE_VALID_ISO8601
    }
  }
}, ['body']))

// access token
export const accessTokenValidator = validate(checkSchema({
  Authorization: {
    custom: {
      options: async (value: string, { req }) => {
        const access_token = (value || '').split(' ')[1]
        if (!access_token) {
          throw new ErrorStatus({
            message: USER_VALID_MESSAGES.ACCESS_TOKEN_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        try {
          const decoded_authorization = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
          })
            ; (req as Request).decoded_authorization = decoded_authorization
        } catch (error) {
          throw new ErrorStatus({
            message: (error as JsonWebTokenError).message,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        return true
      }
    }
  }
}))

export const refreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorStatus({
              message: USER_VALID_MESSAGES.REFRESH_TOKEN_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              }),
              databaseService.refreshTokens.findOne({ token: value })
            ])
            if (refresh_token === null) {
              throw new ErrorStatus({
                message: USER_VALID_MESSAGES.REFRESH_TOKEN_USED_OR_NOTEXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            (req as Request).decoded_refresh_token = decoded_refresh_token
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorStatus({
                message: USER_VALID_MESSAGES.REFRESH_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }
        }
      }
    }
  }, ['body'])
)

export const emailVerifyTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorStatus({
              message: USER_VALID_MESSAGES.REFRESH_TOKEN_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decoded_refresh_token = await
              verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRETKEY_EMAIL_VERIFY_TOKEN as string
              })

              ; (req as Request).decoded_refresh_token = decoded_refresh_token
          } catch (error) {
            throw new ErrorStatus({
              message: capitalize((error as JsonWebTokenError).message),
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          return true
        }
      }
    }
  }, ['body'])
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_VALID_MESSAGES.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: USER_VALID_MESSAGES.EMAIL_VALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new Error(USER_VALID_MESSAGES.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      },
    }
  )
)