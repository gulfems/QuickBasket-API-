import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '../components/PaymentForm.jsx';

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




    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>{error}</p>);
    const DELIVERY_FEE = 45;
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <div className="min-h-screen">
            <main className="mx-auto px-6 py-24 max-w-2xl">
                <h1 className="text-4xl tracking-tight">Checkout</h1>

                <section className="mt-8">
                    <h2 className="text-lg mb-3">Deliver to</h2>
                    <select
                        value={addressId}
                        onChange={(e) => setAddressId(e.target.value)}
                        className="border rounded-md px-4 py-3 w-full">
                        <option value="">Choose an address</option>
                        {addresses.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name} - {a.address_text}
                            </option>
                        ))}
                    </select>
                </section>

                <section className="mt-8">
                    <h2 className="text-lg mb-2">
                        Your order
                    </h2>
                    <ul className="flex flex-col gap-2">
                        {items.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.quantity} x {item.name}</span>
                                <span>{(Number(item.price) * item.quantity).toFixed(2)} TL</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-8 border-t pt-4 flex flex-col gap-1">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)} TL</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>{DELIVERY_FEE.toFixed(2)} TL</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span>Total</span>
                        <span>{(subtotal + DELIVERY_FEE).toFixed(2)} TL</span>
                    </div>
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <PaymentForm addressId={addressId} />
                        </Elements>
                    ) : (
                        <p>Loading payment...</p>
                    )}
                </section>
            </main>
        </div>
    );
}