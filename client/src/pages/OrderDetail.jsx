import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


const STATUS = {
    preparing: { label: 'Preparing', className: 'bg-lemon text-ink' },
    on_the_way: { label: 'On the way', className: 'bg-volt text-ink' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

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
    const status = STATUS[order.status] || { label: order.status, className: 'bg-line text-ink' };

    return (
        <main className="max-w-3xl mx-auto px-6 py-12">
            <Link to="/orders" className="text-sm text-muted hover:text-ink">← All orders</Link>

            <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl">Order #{order.id}</h1>
                    <p className="mt-1 text-sm text-muted">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <span className={`text-xs font-semibold rounded-full px-3 py-1 ${status.className}`}>
                    {status.label}
                </span>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
                {(order.items || []).map((item) => (
                    <li key={item.product_id} className="flex items-center gap-4 bg-white border border-line rounded-2xl p-3">
                        <img src={item.image_url} alt={item.name} className="h-16 w-16 object-contain" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-2">{item.name}</p>
                            <p className="text-sm text-muted">
                                {item.quantity} × {Number(item.price_at_purchase).toFixed(2)} TL
                            </p>
                        </div>
                        <p className="font-semibold">
                            {(Number(item.price_at_purchase) * item.quantity).toFixed(2)} TL
                        </p>
                    </li>
                ))}
            </ul>

            <div className="mt-6 bg-white border border-line rounded-2xl p-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{Number(order.total).toFixed(2)} TL</span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span>Delivery</span>
                    <span>{Number(order.delivery_fee).toFixed(2)} TL</span>
                </div>
                <div className="mt-4 pt-4 border-t border-line flex justify-between text-lg font-semibold">
                    <span>Total paid</span>
                    <span>{(Number(order.total) + Number(order.delivery_fee)).toFixed(2)} TL</span>
                </div>
            </div>

            {cancelError && <p className="mt-4 text-sm text-red-600">{cancelError}</p>}

            {order.status === 'preparing' && (
                <button
                    onClick={handleCancel}
                    className="mt-6 rounded-full border border-red-300 text-red-700 px-6 py-3 font-semibold hover:bg-red-50">
                    Cancel order
                </button>
            )}
        </main>
    );
}
