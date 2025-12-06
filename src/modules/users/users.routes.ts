import { Router } from "express";
import * as userControllers from "./users.controller"
import authenticate from "../../middleware/auth";

const usersRouter = Router()

usersRouter.get('/api/v1/users', authenticate('admin'), userControllers.getAllUsersController)
usersRouter.put('/api/v1/users/:userId', authenticate('admin', 'customer'), userControllers.updateUserController)
usersRouter.delete('/api/v1/users/:userId', authenticate('admin'), userControllers.deleteUserController)

export default usersRouter