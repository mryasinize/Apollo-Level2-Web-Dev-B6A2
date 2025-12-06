import { Request, Response } from "express";
import { createUser, signinUser } from "./auth.service";

export const signupController = async (req: Request, res: Response) => {
    try {
        const data = await createUser(req.body)
        if (!data) {
            res.status(400).json({
                success: false,
                message: "Email already exists. Try another",
                errors: "Email already exists. Try another",
            })
        } else {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data
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

export const signinController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const data = await signinUser(email, password)
        if (!data) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                errors: "Invalid email or password",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Login successful",
                data,
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