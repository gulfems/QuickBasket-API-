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

        const orderResult = await client.query(
            'INSERT INTO orders (user_id, address_id, total, delivery_fee) VALUES($1, $2, $3, $4) RETURNING *',
            [userId, address_id, total, DELIVERY_FEE]
        );

        const order = orderResult.rows[0];
        for (const item of items) {
            await client.query('INSERT INTO order_items (order_id,product_id,quantity,price_at_purchase) VALUES ($1,$2,$3,$4)', [order.id, item.product_id, item.quantity, item.price]);
            await client.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [item.quantity, item.product_id]);
        }
        await client.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);
        await client.query('COMMIT');
        return res.status(201).json({ message: 'Order placed:', order });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    } finally {
        client.release();
    }
}