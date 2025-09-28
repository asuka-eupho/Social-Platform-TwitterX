import { Request, Response } from "express";
import databaseService from "~/services/database.services";
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import userService from "~/services/users.services";
import { LogoutReqBody, RegisterReqBody } from "~/models/requests/user.requests";
import User from "~/models/schemas/User.schema";
import { ObjectId } from "mongodb";

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userService.login(user_id.toString())
  return res.json({
    message: 'Login successfully',
    result
  })


}
export const registerController = async (req: Request<ParamsDictionary, any
  , RegisterReqBody>, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body)
    return res.json({
      message: 'Register Done',
      result
    })
  } catch (error) {
    next(error)
  }
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.json(result)
}