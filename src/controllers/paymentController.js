import pool from '../db/index.js';
import { MINIMUM_BASKET, DELIVERY_FEE } from './orderController.js';
import { stripe } from '../config/stripe.js';



export const createPaymentIntent = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartResult = await pool.query(
            `SELECT cart_items.product_id, cart_items.quantity,
                products.name, products.price
                FROM carts
                JOIN cart_items ON cart_items.cart_id = carts.id
                JOIN products ON products.id = cart_items.product_id
                WHERE carts.user_id = $1
        `, [userId]);

        const items = cartResult.rows;
        if (items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty', status: 400 });
        }
        let total = 0;
        for (const item of items) {
            total += Number(item.price) * item.quantity;
        }
        if (total < MINIMUM_BASKET) {
            return res.status(400).json({ message: `Minimum order amount is ${MINIMUM_BASKET} TL.Your basket total is ${total.toFixed(2)} TL`, status: 400 });
        }
        const amount = Math.round((total + DELIVERY_FEE) * 100);
        const paymentIntent = await stripe.paymentIntents.create({ amount, currency: 'try', automatic_payment_methods: { enabled: true } });
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment intent failed:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}
