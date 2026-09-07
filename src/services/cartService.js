import pool from '../db/index.js';

export const findProduct = async (productId) => {
    const result = await pool.query(
        'SELECT id, quantity, price FROM products WHERE id = $1 AND is_active = true',
        [productId]
    );
    return result.rows[0] || null;
};

export const findOrCreateCart = async (userId) => {

    const existing = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
        return existing.rows[0].id;
    }

    const created = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
    return created.rows[0].id;
}

export const findCartItem = async (cartId, productId) => {
    const result = await pool.query(
        'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [cartId, productId]
    );
    return result.rows[0] || null;
};

export const insertCartItem = async (cartId, productId, quantity) => {
    const result = await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [cartId, productId, quantity]
    );
    return result.rows[0];
};

export const updateCartItemQuantity = async (itemId, quantity) => {
    const result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [quantity, itemId]
    );
    return result.rows[0];
};

export const findCartByUser = async (userId) => {
    const result = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    return result.rows[0] || null;
};

export const findCartItemInCart = async (itemId, cartId) => {
    const result = await pool.query(
        'SELECT id, product_id, quantity FROM cart_items WHERE id = $1 AND cart_id = $2',
        [itemId, cartId]
    );
    return result.rows[0] || null;
};