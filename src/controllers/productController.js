import pool from '../db/index.js';

export const getAllProducts = async (req, res) => {
    const { category, search, limit = 20, offset = 0 } = req.query;

    let sql = 'SELECT * FROM products WHERE is_active = true';
    const values = [];

    if (category) {
        values.push(category);
        sql += ` AND category_id = $${values.length}`;
    }

    if (search) {
        values.push(`%${search}%`);
        sql += ` AND name ILIKE $${values.length}`;
    }

    sql += ' ORDER BY name ASC';

    values.push(limit);
    sql += ` LIMIT $${values.length}`;

    values.push(offset);
    sql += ` OFFSET $${values.length}`;
    try {
        const result = await pool.query(sql, values);
        res.status(200).json({ products: result.rows });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error', status: 500 });

    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1 AND is_active = true', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found', status: 404 });
        }
        res.status(200).json({ product: result.rows[0] });
    } catch (error) {
        console.error('Error fetching product by Id:', error);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const createProduct = async (req, res) => {
    const { category_id, name, price, quantity, description, image_url } = req.body;

    if (!category_id || !name || !price) {
        return res.status(400).json({ message: 'Category ID, name and price are required', status: 400 });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (category_id, name, price, quantity, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [category_id, name, price, quantity || 0, description || '', image_url || '']);

        res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });

    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }

}

export const updateProduct = async (req, res) => {

    const productId = req.params.id;

    const { category_id, name, price, quantity, description, image_url } = req.body;

    if (!category_id || !name || !price) {
        return res.status(400).json({ message: 'Category ID, name and price are required', status: 400 });
    }

    try {
        const result = await pool.query(
            'UPDATE products SET category_id = $1, name = $2, price = $3, quantity = $4, description = $5, image_url = $6 WHERE id = $7 RETURNING *',
            [category_id, name, price, quantity, description, image_url, productId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found', status: 404 });
        }
        res.status(200).json({ message: 'Product updated successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await pool.query(
            'UPDATE products SET is_active = false WHERE id = $1 RETURNING id', [productId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found', status: 404 });
        }
        res.status(200).json({ message: 'product deleted successfully' });
    } catch (error) {
        console.log('Error deleting product', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}