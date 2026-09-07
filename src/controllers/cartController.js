import pool from '../db/index.js';
import { findProduct, findOrCreateCart, findCartItem, insertCartItem, updateCartItemQuantity, findCartByUser, findCartItemInCart } from '../services/cartService.js';

export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT ci.id, ci.product_id, ci.quantity,
                    p.name, p.price, p.image_url
             FROM carts c
             JOIN cart_items ci ON ci.cart_id = c.id
             JOIN products p ON p.id = ci.product_id
             WHERE c.user_id = $1
             ORDER BY p.name ASC`,
            [userId]
        );
        res.status(200).json({ items: result.rows });
    } catch (error) {
        console.log('Could not get cart', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}


export const addToCart = async (req, res) => {

    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ message: 'Product and quantity are required fields', status: 400 });

    }

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity can not be lesser than 0', status: 400 });
    }

    try {
        const product = await findProduct(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', status: 404 });
        }
        if (quantity > product.quantity) {
            return res.status(400).json({ message: 'Out of stock', status: 400 });
        }

        const cartId = await findOrCreateCart(userId);
        const existing = await findCartItem(cartId, product_id);
        if (existing) {
            const newQuantity = existing.quantity + quantity;
            if (newQuantity > product.quantity) {
                return res.status(400).json({ message: 'Out of stock', status: 400 });
            }
            const updated = await updateCartItemQuantity(existing.id, newQuantity);
            return res.status(200).json({ message: 'Cart item updated', item: updated });
        }
        else {
            const item = await insertCartItem(cartId, product_id, quantity);
            return res.status(201).json({ message: 'Cart item added', item });
        }
    } catch (error) {
        console.error('Cant create or update cart', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }

}

export const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
        return res.status(400).json({ message: 'Quantity is required', status: 400 });
    }
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0', status: 400 });
    }

    try {
        const cart = await findCartByUser(userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', status: 404 });
        }
        const item = await findCartItemInCart(id, cart.id);
        if (!item) {
            return res.status(404).json({ message: 'Cart item not found', status: 404 });
        }
        const product = await findProduct(item.product_id);
        if (quantity > product.quantity) {
            return res.status(400).json({ message: 'Out of stock', status: 400 });
        }

        const updated = await updateCartItemQuantity(id, quantity);
        return res.status(200).json({ message: 'Cart item updated', item: updated });
    } catch (error) {
        console.error('Could not update cart item:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}