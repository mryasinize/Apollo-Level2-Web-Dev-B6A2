import { pool } from "../../config/db";

export const createVehicles = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload

    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE registration_number=$1`, [registration_number])

    if (vehicle.rowCount !== 0) {
        return null
    }

    const data = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )

    return data.rows[0]
};

export const getAllVehicles = async () => {
    const data = await pool.query(`SELECT * FROM vehicles`)
    return data.rows
};

export const getVehicleById = async (vehicleId: string) => {
    const data = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId])
    return data.rows[0]
};

export const updateVehicle = async (vehicleId: string, payload: Record<string, unknown>) => {
    const updates = []
    // creating update query statement dynamically since all the properties are optional
    for (const key in payload) {
        if (!Object.hasOwn(payload, key)) continue;
        updates.push(`${key}='${payload[key]}'`)
    }
    const data = await pool.query(`UPDATE vehicles SET ${updates.join(', ')} WHERE id='${vehicleId}' RETURNING *`)
    return data.rows[0]
};

export const deleteVehicle = async (vehicleId: string) => {
    const booking = await pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`, [vehicleId])
    if (booking.rowCount === 0) {
        await pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId])
        return true
    } else {
        return false
    }
};