import { Router } from "express";
import { emailVerifyController, forgotPasswordController, loginController, logoutController, registerController, resendEmailVerifyController } from "~/controllers/users.controllers";
import { accessTokenValidator, emailVerifyTokenValidator, forgotPasswordValidator, loginValidator, refreshTokenValidator, registerValidator } from "~/middlewares/users.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";
const userRouter = Router()

userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

userRouter.post("/logout", accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

userRouter.post("/verify-email", emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

userRouter.post("/resend-verify-email", accessTokenValidator, wrapRequestHandler(resendEmailVerifyController))


userRouter.post("/forgot-password", forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
export default userRouter