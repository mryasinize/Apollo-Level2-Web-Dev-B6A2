import bcrypt from 'bcrypt'
import { pool } from "../../config/db";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config';

export const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload

    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])

    if (user.rowCount !== 0) {
        return null
    }

    const hashedPassword = await bcrypt.hash(password as string, 10)

    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
        [name, email, hashedPassword, phone, role]
    )

    return result.rows[0]
};

export const signinUser = async (email: string, password: string) => {
    const users = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])

    if (users.rowCount === 0) {
        return null
    }

    const user = users.rows[0]
    const matchedPassowrd = await bcrypt.compare(password, user.password)

    if (!matchedPassowrd) {
        return null
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET!,
        { expiresIn: '7d' }
    )

    delete user.password

    return { token, user }
};