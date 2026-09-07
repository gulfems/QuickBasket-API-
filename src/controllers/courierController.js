import bcrypt from 'bcrypt';
import pool from '../db/index.js';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export const registerCourier = async (req, res) => {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
        return res.status(400).json({ message: 'Email, password, and phone are required', status: 400 });
    }

    try {
        const existingCourrier = await pool.query('SELECT * FROM couriers WHERE email = $1', [email]);
        if (existingCourrier.rows.length > 0) {
            return res.status(409).json({ message: 'Courrier already exists', status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newCourrier = await pool.query(
            'INSERT INTO couriers (email, password_hash, phone) VALUES ($1, $2, $3) RETURNING id, email, phone, created_at', [email, hashedPassword, phone]
        );
        res.status(201).json({ message: 'Courrier registered successfully', courrier: newCourrier.rows[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const loginCourier = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password fields are required', status: 400 });
    }

    try {
        const courrierResult = await pool.query('SELECT * FROM couriers WHERE email = $1', [email]);
        if (courrierResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password', status: 401 });
        }

        const courrier = courrierResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, courrier.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password', status: 401 });
        }

        jwt.sign({ id: courrier.id, email: courrier.email }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                return res.status(500).json({ message: 'Internal server error', status: 500 });
            }
            res.status(200).json({ message: 'Login successful', token, courrier: { id: courrier.id, email: courrier.email, phone: courrier.phone } });
        });
    } catch (error) {
        console.error('Error logging in courrier:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}