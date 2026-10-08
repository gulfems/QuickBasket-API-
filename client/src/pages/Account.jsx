import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Account = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [addressText, setAddressText] = useState('');
    const [formError, setFormError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {

        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not load addresses');
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

    const handleAddress = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, address_text: addressText })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setAddresses((prev) => [...prev, data.address]);
            setName('');
            setAddressText('');
        } catch (error) {
            setFormError(error.message);
        }
    }

    const deleteAddress = async (id) => {
        setFormError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setAddresses((prev) => prev.filter((a) => a.id !== id));
        } catch (error) {
            setFormError(error.message);
        }
    }

    if (loading) return (<p>Loading addresses</p>);
    if (error) return (<p>{error}</p>);

    return (
        <div className="min-h-screen">
            <main className="mx-auto px-6 py-24">
                <h1 className="text-4xl tracking-tight">Your addresses</h1>

                <form onSubmit={handleAddress} className="mt-8 flex flex-col gap-4 max-w-md">
                    {formError && (
                        <p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 text-sm">
                            {formError}
                        </p>
                    )}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name (Home, Work…)"
                        required
                        className="border rounded-md px-4 py-3"
                    />
                    <input
                        type="text"
                        value={addressText}
                        onChange={(e) => setAddressText(e.target.value)}
                        placeholder="Full address"
                        required
                        className="border rounded-md px-4 py-3"
                    />
                    <button type="submit" className="border rounded-md px-6 py-3">
                        Add address
                    </button>
                </form>

                <ul className="mt-8 flex flex-col gap-4">
                    {addresses.map((address) => (
                        <li key={address.id} className="border rounded-md p-4">
                            <h2 className="text-lg">{address.name}</h2>
                            <p>{address.address_text}</p>
                            <button onClick={() => deleteAddress(address.id)}>X</button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}