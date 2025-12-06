import { Request, Response } from "express";
import { createBooking, getAllBookings, updateBooking } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

export const createBookingController = async (req: Request, res: Response) => {
    try {
        const data = await createBooking(req.body)
        if (!data) {
            res.status(400).json({
                success: false,
                message: "Could not book vehicle.",
                errors: "Could not book vehicle. Vehicle is already booked.",
            })
        } else {
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data
            })
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error
        })
    }
};

export const getAllBookingsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllBookings(req.user as JwtPayload)
        res.status(200).json({
            success: true,
            message: "Your bookings retrieved successfully",
            data
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error
        })
    }
};

export const updateBookingController = async (req: Request, res: Response) => {
    try {
        const data = await updateBooking(req.user as JwtPayload, req.params.bookingId as string, req.body)
        if (!data) {
            res.status(403).json({
                success: false,
                message: "Could not cancel booking.",
                errors: "Could not cancel booking. Booking has already been started",
            })
        } else {
            res.status(200).json({
                success: true,
                message: req.user!.role === 'admin' ? "Booking marked as returned. Vehicle is now available" : "Booking cancelled successfully",
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