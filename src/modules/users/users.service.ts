import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

export const getAllUsers = async () => {
    const users = await pool.query(`SELECT id, name, email, phone, role FROM users`)
    return users.rows
};

export const updateUser = async (user: JwtPayload, userId: string, payload: Record<string, unknown>) => {
    const updates = []
    // creating query statement dynamically since all the properties of 'payload' are optional
    for (const key in payload) {
        if (!Object.hasOwn(payload, key)) continue;
        updates.push(`${key}='${payload[key]}'`)
    }

    if (user.role === 'admin' || (user.role === 'customer' && user.id == userId)) {
        const data = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id='${userId}' RETURNING id, name, email, phone, role`)
        return data.rows[0]
    } else {
        // that means customer is trying to update other user's data, which is not allowed!
        return null
    }
};

export const deleteUser = async (userId: string) => {
    const booking = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId])
    if (booking.rowCount === 0) {
        await pool.query(`DELETE FROM users WHERE id=$1`, [userId])
        return true
    } else {
        return false
    }
};