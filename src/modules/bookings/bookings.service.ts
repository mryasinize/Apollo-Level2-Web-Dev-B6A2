import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

export const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload
    const vehicleData = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id])
    const vehicle = vehicleData.rows[0]

    if (vehicle.availability_status !== 'available') {
        return null;
    }

    const startDate = Date.parse(rent_start_date as string)
    const endDate = Date.parse(rent_end_date as string)
    const totalDuration = (endDate - startDate) / 86400000
    const totalPrice = vehicle.daily_rent_price * totalDuration

    const data = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, 'active']
    )

    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id])

    return {
        ...data.rows[0],
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    }
};

export const getAllBookings = async (user: JwtPayload) => {
    let data;
    if (user.role === 'admin') {
        const bookings = await pool.query(`
            SELECT 
            bookings.*, 
            users.name, 
            users.email, 
            vehicles.vehicle_name, 
            vehicles.registration_number
            FROM bookings
            JOIN users ON users.id = bookings.customer_id
            JOIN vehicles ON vehicles.id = bookings.vehicle_id
            `)
        data = bookings.rows.map(row => {
            const { name, email, vehicle_name, registration_number, ...rest } = row
            return {
                ...rest,
                customer: {
                    name,
                    email
                },
                vehicle: {
                    vehicle_name,
                    registration_number
                }
            }
        })
    } else if (user.role === 'customer') {
        const bookings = await pool.query(`
            SELECT 
            bookings.*, 
            vehicles.vehicle_name, 
            vehicles.registration_number,
            vehicles.type
            FROM bookings 
            JOIN vehicles ON vehicles.id = bookings.vehicle_id
            WHERE customer_id=$1
            `,
            [user.id]
        )
        data = bookings.rows.map(row => {
            const { customer_id, vehicle_name, registration_number, type, ...rest } = row
            return {
                ...rest,
                vehicle: {
                    vehicle_name,
                    registration_number,
                    type
                }
            }
        })
    }
    return data
};

export const updateBooking = async (user: JwtPayload, bookingId: string, payload: Record<string, unknown>) => {
    // System: auto marking as 'returned' when period ends
    await pool.query(`UPDATE bookings SET status='returned' WHERE rent_end_date < NOW()`)

    if (user.role === 'admin') {

        const data = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [payload.status, bookingId])
        await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [data.rows[0].vehicle_id])

        return { ...data.rows[0], vehicle: { availability_status: "available" } }
        
    } else if (user.role === 'customer') {

        const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1 AND customer_id=$2 AND rent_start_date > NOW()`, [bookingId, user.id])

        if (booking.rowCount !== 0) {
            // that means customer has a booking that has not started yet thus allowd to cancel
            const data = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING *`, [payload.status, bookingId, user.id])
            return data.rows[0]
        } else {
            return null
        }
    }
};