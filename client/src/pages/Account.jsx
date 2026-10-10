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

    if (loading) return (<p className="max-w-6xl mx-auto px-6 py-12 text-muted">Loading addresses…</p>);
    if (error) return (<p className="max-w-6xl mx-auto px-6 py-12 text-red-600">{error}</p>);

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="font-display text-3xl">Your account</h1>

            <div className="mt-8 grid md:grid-cols-3 gap-8 items-start">

                <section className="md:col-span-2">
                    <h2 className="font-display text-xl">Saved addresses</h2>

                    {addresses.length === 0 ? (
                        <p className="mt-3 text-muted">No addresses yet. Add your first one.</p>
                    ) : (
                        <ul className="mt-4 flex flex-col gap-3">
                            {addresses.map((address) => (
                                <li key={address.id} className="flex items-start justify-between gap-4 bg-white border border-line rounded-2xl p-5">
                                    <div className="min-w-0">
                                        <p className="font-semibold">{address.name}</p>
                                        <p className="mt-1 text-sm text-muted">{address.address_text}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteAddress(address.id)}
                                        className="text-sm text-muted hover:text-red-600">
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="bg-white border border-line rounded-2xl p-6 md:sticky md:top-28">
                    <h2 className="font-display text-xl">Add an address</h2>

                    <form onSubmit={handleAddress} className="mt-4 flex flex-col gap-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name (Home, Work…)"
                            required
                            className="rounded-xl border border-line px-4 py-3 focus:outline-none focus:ring-2 focus:ring-volt"
                        />
                        <textarea
                            value={addressText}
                            onChange={(e) => setAddressText(e.target.value)}
                            placeholder="Full address"
                            required
                            rows={3}
                            className="rounded-xl border border-line px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-volt"
                        />
                        {formError && <p className="text-sm text-red-600">{formError}</p>}
                        <button
                            type="submit"
                            className="mt-2 bg-volt hover:bg-volt-dark rounded-full px-6 py-3 font-semibold">
                            Add address
                        </button>
                    </form>
                </section>

            </div>
        </main>
    );
}
