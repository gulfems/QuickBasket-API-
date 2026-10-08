import bcrypt from 'bcrypt';
import pool from '../db/index.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
        return res.status(400).json({ message: 'Email, password, and phone are required', status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format', status: 400 });
    };

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists', status: 409 });
        }



        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, phone) VALUES ($1, $2, $3) RETURNING id, email, phone, is_admin, created_at', [email, hashedPassword, phone]

        );
        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password fields are required', status: 400 });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password', status: 401 });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password', status: 401 });
        }

        jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                return res.status(500).json({ message: 'Internal server error', status: 500 });
            }
            res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email, phone: user.phone, is_admin: user.is_admin } });
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const googleLogin = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Credential is a required field' });
    }

    try {
        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const { sub, email, email_verified } = ticket.getPayload();
        if (!email_verified) {
            return res.status(401).json({ message: 'Not a verified email.' });
        }
        let user;
        const result = await pool.query('SELECT id, email, is_admin FROM users WHERE google_id=$1', [sub]);
        if (result.rows.length !== 0) {
            user = result.rows[0];
        }
        if (!user) {
            const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (result.rows.length !== 0) {
                const updateUser = await pool.query('UPDATE users SET google_id=$1 WHERE id=$2 RETURNING id, email, is_admin', [sub, result.rows[0].id]);
                user = updateUser.rows[0];
            }
        }
        if (!user) {
            const result = await pool.query('INSERT INTO users (email,google_id) VALUES ($1,$2) RETURNING id, email, is_admin', [email, sub]);
            user = result.rows[0];
        }
        jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                return res.status(500).json({ message: 'Internal server error', status: 500 });
            }
            res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email, is_admin: user.is_admin } });
        });
    } catch (error) {
        console.error('Google login failed:', error);
        return res.status(401).json({ message: 'Invalid Google credential.' });
    }
}


export const getMe = async (req, res) => {
    const userId = req.user.id;

    try {
        const userResult = await pool.query('SELECT id, email, phone, is_admin, created_at FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        res.status(200).json({ user: userResult.rows[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}
