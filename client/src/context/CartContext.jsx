import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext.jsx';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!token) {
            setItems([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setItems(data.items);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addItem = async (product_id, quantity) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ product_id, quantity })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        await fetchCart();
    };

    const updateItem = async (itemId, quantity) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        await fetchCart();
    };

    const removeItem = async (itemId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        await fetchCart();
    };

    const clearCart = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        await fetchCart();
    };

    return (<CartContext.Provider value={{ items, loading, error, addItem, updateItem, removeItem, clearCart }}>

        {children}
    </CartContext.Provider>);
};

export const useCart = () => useContext(CartContext);