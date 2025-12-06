import { Request, Response } from "express";
import { deleteUser, getAllUsers, updateUser } from "./users.service";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error
        })
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const data = await updateUser(req.user!, req.params.userId as string, req.body)
        if (data) {

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data
            })
        } else {
            res.status(403).json({
                success: false,
                message: "Forbidden",
                errors: "You are not allowed to perform this action"
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error
        })
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const succeeded = await deleteUser(req.params.userId as string)
        if (succeeded) {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Couldn't delete user. User has active bookings",
                errors: "Couldn't delete user. User has active bookings"
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error
        })
    }
};