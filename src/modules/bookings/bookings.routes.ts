import { Router } from "express";
import * as bookingControllers from "./bookings.controller"
import authenticate from "../../middleware/auth";

const bookingsRouter = Router()

bookingsRouter.post('/api/v1/bookings', authenticate('admin', 'customer'), bookingControllers.createBookingController)
bookingsRouter.get('/api/v1/bookings', authenticate('admin', 'customer'), bookingControllers.getAllBookingsController)
bookingsRouter.put('/api/v1/bookings/:bookingId', authenticate('admin', 'customer'), bookingControllers.updateBookingController)

export default bookingsRouter