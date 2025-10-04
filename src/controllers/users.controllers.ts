import { Request, Response } from "express";
import databaseService from "~/services/database.services";
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import userService from "~/services/users.services";
import { ForgotPasswordReqBody, LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayload, VerifyEmailReqBody } from "~/models/requests/user.requests";
import User from "~/models/schemas/User.schema";
import { ObjectId } from "mongodb";
import HTTP_STATUS from "~/constants/httpStatus";
import { USER_VALID_MESSAGES } from "~/constants/messages";
import { UserVerifyStatus } from "~/constants/enums";

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userService.login(user_id.toString())
  return res.json({
    message: 'Login successfully',
    result
  })


}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body)
    return res.json({
      message: 'Register Done, Welcome bro!',
      result
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.json(result)
}
export const emailVerifyController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_VALID_MESSAGES.USER_NOT_FOUND
    })
  }
  //Verified success
  if (user.email_verify_token === '') {
    return res.json({
      message: USER_VALID_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USER_VALID_MESSAGES.EMAIL_VERIFY_OK,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_VALID_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_VALID_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }
  const result = await userService.resendVerifyEmail(user_id)
  return res.json(result)
}
export const forgotPasswordController = async (req: Request<ParamsDictionary, any, ForgotPasswordReqBody>, res: Response, next: NextFunction) => {
  const { _id } = req.user as User
  const result = await userService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
} 