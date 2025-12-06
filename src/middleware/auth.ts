import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "../config";

const authenticate = (...roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
                errors: "Unauthorized"
            })
        } else {
            const token = authHeader.split(" ")[1]!
            jwt.verify(token, JWT_SECRET!, (error, payload) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized",
                        errors: error
                    })
                } else if (roles.length && !roles.includes((payload as JwtPayload).role as string)) {
                    res.status(403).json({
                        success: false,
                        message: "Forbidden",
                        errors: "You do not have sufficient permission to perform this action"
                    })
                } else {
                    req.user = payload as JwtPayload
                    next()
                }
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error
        })
    }
}

export default authenticate