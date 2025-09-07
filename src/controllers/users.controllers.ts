import { Request, Response } from "express";
import databaseService from "~/services/database.services";
import {ParamsDictionary} from 'express-serve-static-core'
import userService from "~/services/users.services";
import { RegisterReqBody } from "~/models/requests/user.requests";

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login ok'
  })
}
export const registerController = async (req: Request<ParamsDictionary,any,RegisterReqBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    return res.json({
      message: 'Register Done',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Failed',
      error
    })
  }
}