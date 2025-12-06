import { Router } from "express";
import * as vehiclesControllers from "./vehicles.controller";
import authenticate from "../../middleware/auth";

const vehiclesRouter = Router()

vehiclesRouter.post('/api/v1/vehicles', authenticate('admin'), vehiclesControllers.createVehiclesController)
vehiclesRouter.get('/api/v1/vehicles', vehiclesControllers.getAllVehiclesController)
vehiclesRouter.get('/api/v1/vehicles/:vehicleId', vehiclesControllers.getVehicleByIdController)
vehiclesRouter.put('/api/v1/vehicles/:vehicleId', authenticate('admin'), vehiclesControllers.updateVehicleController)
vehiclesRouter.delete('/api/v1/vehicles/:vehicleId', authenticate('admin'), vehiclesControllers.deleteVehicleController)

export default vehiclesRouter