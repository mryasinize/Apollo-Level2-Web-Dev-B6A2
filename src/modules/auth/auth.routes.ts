import { Router } from "express";
import { signinController, signupController } from "./auth.controller";

const authRouter = Router()

authRouter.post('/api/v1/auth/signup', signupController)
authRouter.post('/api/v1/auth/signin', signinController)

export default authRouter