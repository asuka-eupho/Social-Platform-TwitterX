import { error } from 'console'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USER_VALID_MESSAGES } from '~/constants/messages'
import userService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Something went wrongs'
    })
  }
  next()
}
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
    custom:{
      options: async(value) => {
        const isExist = await userService.checkEmailExist(value)
        if(isExist){
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
        minSymbols:0,
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
}))