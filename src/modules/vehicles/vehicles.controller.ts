import { Request, Response } from "express";
import { createVehicles, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from "./vehicles.service";

export const createVehiclesController = async (req: Request, res: Response) => {
    try {
        const data = await createVehicles(req.body)
        if (!data) {
            res.status(400).json({
                success: false,
                message: "Vehicle already exists.",
                errors: "Vehicle already exists.",
            })
        } else {
            res.status(201).json({
                success: true,
                message: "Vehicle created successfully",
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

export const getAllVehiclesController = async (req: Request, res: Response) => {
    try {
        const data = await getAllVehicles()
        res.status(200).json({
            success: true,
            message: data.length === 0 ? "No vehicles found" : "Vehicles retrieved successfully",
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

export const getVehicleByIdController = async (req: Request, res: Response) => {
    try {
        const data = await getVehicleById(req.params.vehicleId as string)
        if (!data) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "Vehicle not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
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

export const updateVehicleController = async (req: Request, res: Response) => {
    try {
        const data = await updateVehicle(req.params.vehicleId as string, req.body)
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
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

export const deleteVehicleController = async (req: Request, res: Response) => {
    try {
        const succeeded = await deleteVehicle(req.params.vehicleId as string)
        if (succeeded) {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Could not delete vehicle",
                errors: "Could not delete vehicle. Active booking of this vehicle exist."
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