import { Request, Response } from "express";
import databaseService from "~/services/database.services";
import userService from "~/services/users.services";

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login ok'
  })
}
export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await userService.register({ email, password })
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