import pool from '../db/index.js';

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT id, email, phone, is_admin, created_at FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        if (req.user.id !== Number(id) && !req.user.is_admin) {
            return res.status(403).json({ message: 'You are not authorized to access this resource', status: 403 });
        }
        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Could not get user:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, phone } = req.body;

    if (!email || !phone) {
        return res.status(400).json({ message: 'Email and phone are required', status: 400 });
    }

    try {
        if (req.user.id !== Number(id)) {
            return res.status(403).json({ message: 'You are not authorized to see the resources', status: 403 });
        }
        const result = await pool.query('UPDATE users SET email = $1, phone = $2 WHERE id = $3 RETURNING id, email, phone, is_admin, created_at', [email, phone, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Email already in use', status: 409 });
        }
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.id !== Number(id) && !req.user.is_admin) {
            return res.status(403).json({ message: 'You are not authorized to delete this user', status: 403 });
        }
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        res.status(200).json({ message: 'User deleted successfully', status: 200 });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'User has existing orders and cannot be deleted', status: 409 });
        }
        console.error('Cannot delete user:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}