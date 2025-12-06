import express from 'express'
import { PORT } from './config'
import { initDB } from './config/db'
import authRouter from './modules/auth/auth.routes'
import vehiclesRouter from './modules/vehicles/vehicles.routes'
import usersRouter from './modules/users/users.routes'
import bookingsRouter from './modules/bookings/bookings.routes'

const app = express()
initDB()

app.use(express.json())
app.use(authRouter)
app.use(vehiclesRouter)
app.use(usersRouter)
app.use(bookingsRouter)

app.listen(PORT, (err) => {
    if (err) console.log(err.message);
    console.log("RUNNING!", PORT);
})