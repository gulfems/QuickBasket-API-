import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '../components/PaymentForm.jsx';
import { Link } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Checkout = () => {
    const { token } = useAuth();
    const { items } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [addressId, setAddressId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {

        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setAddresses(data.addresses);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAddresses();
    }, [token]);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-intent`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message);
                    return;
                }
                setClientSecret(data.clientSecret);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPayment();
    }, [token]);

    if (loading) return (<p className="max-w-6xl mx-auto px-6 py-12 text-muted">Loading checkout…</p>);
    if (error) return (<p className="max-w-6xl mx-auto px-6 py-12 text-red-600">{error}</p>);

    const DELIVERY_FEE = 45;
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#141414',
            colorText: '#141414',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
        },
    };

    return (
        <div className="min-h-screen">
            <main className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="font-display text-3xl">Checkout</h1>

                <div className="mt-8 grid md:grid-cols-3 gap-8 items-start">

                    <div className="md:col-span-2 flex flex-col gap-6">

                        <section className="bg-white border border-line rounded-2xl p-6">
                            <h2 className="font-display text-xl">Deliver to</h2>
                            {addresses.length === 0 ? (
                                <p className="mt-3 text-muted">
                                    You have no saved addresses.{' '}
                                    <Link to="/account" className="text-ink font-semibold underline">Add one</Link>
                                </p>
                            ) : (
                                <select
                                    value={addressId}
                                    onChange={(e) => setAddressId(e.target.value)}
                                    className="mt-3 w-full rounded-xl border border-line px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-volt">
                                    <option value="">Choose an address</option>
                                    {addresses.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} - {a.address_text}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </section>

                        <section className="bg-white border border-line rounded-2xl p-6">
                            <h2 className="font-display text-xl mb-4">Payment</h2>
                            {clientSecret ? (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                    <PaymentForm addressId={addressId} />
                                </Elements>
                            ) : (
                                <p className="text-muted">Loading payment…</p>
                            )}
                        </section>

                    </div>

                    <div className="bg-white border border-line rounded-2xl p-6 md:sticky md:top-28">
                        <h2 className="font-display text-xl">Your order</h2>

                        <ul className="mt-4 flex flex-col gap-3">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center gap-3">
                                    <img src={item.image_url} alt={item.name} className="h-12 w-12 object-contain" />
                                    <span className="flex-1 min-w-0 text-sm line-clamp-2">
                                        {item.quantity} × {item.name}
                                    </span>
                                    <span className="text-sm font-medium">
                                        {(Number(item.price) * item.quantity).toFixed(2)} TL
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-4 border-t border-line flex justify-between">
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} TL</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <span>Delivery</span>
                            <span>{DELIVERY_FEE.toFixed(2)} TL</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-line flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{(subtotal + DELIVERY_FEE).toFixed(2)} TL</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}


