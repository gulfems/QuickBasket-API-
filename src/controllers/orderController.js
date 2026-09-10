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

export const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return res.status(200).json({ orders: result.rows, status: 200 });
    } catch (error) {
        console.error('Could not monitor orders:', error);
        return res.status(500).json({ message: 'Internal server error.', status: 500 });
    }
}

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id= $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found', status: 404 });
        }
        const order = result.rows[0];
        const isOwner = order.user_id === req.user.id;
        const isCourier = order.courier_id === req.user.id && req.user.role === 'courier';
        const isAdmin = req.user.is_admin;

        if (!isOwner && !isCourier && !isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to view this order', status: 403 });
        }
        return res.status(200).json({ order });

    } catch (error) {
        console.error('Could not get the order', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found', status: 404 });
        }
        const order = result.rows[0];
        if (order.user_id !== userId) {
            return res.status(403).json({ message: 'You are not authorized to make this change', status: 403 });
        }
        if (order.status !== 'preparing') {
            return res.status(400).json({ message: 'This order can no longer be cancelled', status: 400 });
        }

        await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', ['cancelled', id]);
        return res.status(200).json({ message: 'Order cancelled', status: 200 });



    } catch (error) {
        console.error('Error cancelling order', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}