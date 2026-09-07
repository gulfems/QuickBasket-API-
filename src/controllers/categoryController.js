import pool from '../db/index.js';

export const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json({ categories: result.rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required', status: 400 });
    }

    try {
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]
        );
        res.status(201).json({ message: 'Category added successfully', status: 201, category: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Category already exists', status: 409 });
        }
        console.error('Error adding category:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required', status: 400 });
    }

    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found', status: 404 });
        }
        res.status(200).json({ message: 'Category updated successfully', status: 200, category: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Category already exists', status: 409 });
        }
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING id', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found', status: 404 });
        }
        res.status(200).json({ message: 'Category deleted successfully', status: 200 });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'Category still has products', status: 409 });
        }
        console.error('Error deleting category', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

export const getCategoryProducts = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY name', [id]);
        res.status(200).json({ products: result.rows });
    } catch (error) {
        console.error('Error listing products according to the category:', error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}