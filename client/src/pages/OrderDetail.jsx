import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const OrderDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setOrder(data.order);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
             }
        }
        fetchOrder();
    }, [token, id]);
    
    const handleCancel = async () => {
        setCancelError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setOrder((prev) => ({ ...prev, status: 'cancelled' }));
        } catch (error) {
            setCancelError(error.message);
        }
    }
    if (loading) return (<p>Loading order</p>);
    if (error) return (<p>{error}</p>);

    return (
        <div>
            <h1>Order #{order.id}</h1>
            <h2>Status: {order.status}</h2>
            <h4>{order.total}</h4>
            <h5>Date: {new Date(order.created_at).toLocaleDateString()}</h5>
            {cancelError && <p>{cancelError}</p>}
            {order.status === 'preparing' && (
                <button onClick={handleCancel}>Cancel</button>
            )}
        </div>
    );
}
 