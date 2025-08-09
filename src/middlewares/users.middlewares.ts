import { error } from 'console'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
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
    notEmpty: true,
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100
      }
    },
    trim: true
  },
  email: {
    notEmpty: true,
    isEmail: true,
    trim: true
  },
  password: {
    notEmpty: true,
    isString: true,
    isLength: {
      options: {
        min: 6,
        max: 100
      }
    },
    isStrongPassword: {
      errorMessage: 'Must be long at least 6 chars and have a number',
      options: {
        minLength: 6,
        minNumbers: 1
      }
    }
  },
  confirm_password: {
    notEmpty: true,
    isString: true,
    isLength: {
      options: {
        min: 6,
        max: 100
      }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minNumbers: 1
      }
    },
    custom: {
      options: (value, { req }) => {
        if (value != req.body.password) {
          throw new Error('Mật khẩu không trùng khớp!!')
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
      }
    }
  }
}))