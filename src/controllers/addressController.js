import pool from '../db/index.js';

export const getMyAddresses = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY name ASC', [userId]);
        res.status(200).json({ addresses: result.rows });
    } catch (error) {
        console.error('Could not get addresses:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const createAddress = async (req, res) => {
    const userId = req.user.id;
    const { name, address_text } = req.body;

    if (!name || !address_text) {
        return res.status(400).json({ message: 'Name and address can not be empty', status: 400 });
    }

    try {
        const result = await pool.query('INSERT INTO addresses (user_id, name, address_text) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, address_text]);
        res.status(201).json({ message: 'Address added successfully', address: result.rows[0] });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: 'You already have an address with this name', status: 409 });
        }
        console.error('Could not add the adress:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const updateAddress = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, address_text } = req.body;

    if (!name || !address_text) {
        return res.status(400).json({ message: 'Name and address can not be empty', status: 400 });
    }
    try {
        const result = await pool.query('UPDATE addresses SET name = $1, address_text = $2 WHERE id = $3 AND user_id = $4 RETURNING * ',
        [name, address_text, id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Address not found', status: 404 });
        }
        res.status(200).json({ message: 'Address updated successfully', address: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'You already have an address with this name', status: 409 });
        }
        console.error('Could not update the address:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const deleteAddress = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Address not found', status: 404 });
        }
        res.status(200).json({ message: 'Address deleted successfully', status: 200 });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'Address is used by an existing order and cannot be deleted', status: 409 });
        }
        console.error('Cannot delete address:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}