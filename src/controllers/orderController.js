import pool from '../db/index.js';
//06.17

const MINIMUM_BASKET = 200;
const DELIVERY_FEE = 45;

export const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { address_id } = req.body;

    if (!address_id) {
        return res.status(400).json({ message: 'Address is a required field', status: 400 });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const addressResult = await client.query('SELECT id FROM addresses WHERE id = $1 AND user_id = $2', [address_id, userId]);
        if (addressResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Address not found', status: 404 });
        }
        const cartResult = await client.query(
            `SELECT cart_items.product_id, cart_items.quantity,
                    products.name, products.price, products.quantity AS stock
             FROM carts
             JOIN cart_items ON cart_items.cart_id = carts.id
             JOIN products ON products.id = cart_items.product_id
             WHERE carts.user_id = $1`,
            [userId]
        );
        const items = cartResult.rows;
        if (items.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Your cart is empty', status: 400 });
        }
        let total = 0;
        for (const item of items) {
            if (item.quantity > item.stock) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `The ${item.name} is not in stock`, status: 400 });
            }
            total += Number(item.price) * item.quantity;
        }
        if (total < MINIMUM_BASKET) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: `Minimum order amount is ${MINIMUM_BASKET} TL. Your basket total is ${total.toFixed(2)} TL.`, status: 400 });
        }
        return res.status(201).json({ total });

        await client.query('COMMIT');
        return res.status(201).json({ message: 'ok', status: 201 })
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    } finally {
        client.release();
    }
}