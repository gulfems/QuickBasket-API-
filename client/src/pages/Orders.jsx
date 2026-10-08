import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export const Orders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setOrders(data.orders);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [token]);

    if (loading) return (<p>Loading orders</p>);
    if (error) return (<p>{error}</p>);

    return (
        <>
            <h1>Your Orders</h1>
            {orders.map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                    <h2>Order #{order.id}</h2>
                    <h3>{order.status}</h3>
                    <h4>{order.total} TL</h4>
                    <h5>Date: {new Date(order.created_at).toLocaleDateString()}</h5>
                </Link>
            ))}
        </>
    );
}