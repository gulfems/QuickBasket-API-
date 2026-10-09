import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export const PaymentForm = ({ addressId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { token } = useAuth();
    const { fetchCart } = useCart();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        if (!addressId) {
            setError('Please choose an address');
            return;
        }
        setProcessing(true);
        setError(null);
        const result = await stripe.confirmPayment({ elements, redirect: 'if_required' });
        const { error: stripeError, paymentIntent } = result;
        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ address_id: Number(addressId), payment_intent_id: paymentIntent.id })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                setProcessing(false);
                return;
            }
            await fetchCart(); //we did not await on checkout
            navigate(`/orders/${data.order.id}`);

        } catch (error) {
            setError(error.message);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <PaymentElement />
                <button type="submit" disabled={!stripe || processing}>
                    {processing ? "Processing..." : "Pay and place order"}
                </button>
                {error && <p>{error}</p>}
            </form>
        </>
    );
}