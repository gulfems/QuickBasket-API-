import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS = {
    preparing: { label: 'Preparing', className: 'bg-lemon text-ink' },
    on_the_way: { label: 'On the way', className: 'bg-volt text-ink' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};


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

    if (loading) return (<p className="max-w-6xl mx-auto px-6 py-12 text-muted">Loading orders…</p>);
    if (error) return (<p className="max-w-6xl mx-auto px-6 py-12 text-red-600">{error}</p>);

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="font-display text-3xl">Your orders</h1>

            {orders.length === 0 ? (
                <p className="mt-4 text-muted">
                    No orders yet.{' '}
                    <Link to="/products" className="text-ink font-semibold underline">Start shopping</Link>
                </p>
            ) : (
                <ul className="mt-8 flex flex-col gap-3">
                    {orders.map((order) => {
                        const status = STATUS[order.status] || { label: order.status, className: 'bg-line text-ink' };
                        return (
                            <li key={order.id}>
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="flex items-center justify-between gap-4 bg-white border border-line rounded-2xl p-5 hover:shadow-md transition">
                                    <div>
                                        <p className="font-semibold">Order #{order.id}</p>
                                        <p className="text-sm text-muted">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${status.className}`}>
                                            {status.label}
                                        </span>
                                        <span className="w-24 text-right font-semibold">
                                            {(Number(order.total) + Number(order.delivery_fee)).toFixed(2)} TL
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}