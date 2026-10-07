import { useCart } from '../context/CartContext';

export const Cart = () => {
    const { items, loading, error, updateItem, removeItem } = useCart();

    if (loading) return (<p>Loading your cart</p>);
    if (error) return (<p>{error}</p>);
    if (items.length === 0) return (<p>Your cart is empty</p>);

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <div className="min-h-screen">
            <main className="mx-auto px-6 py-24">
                <div className="flex items-center justify-center gap-24">
                    <div>
                        <h1 className="text-4xl tracking-tight">
                            Your cart
                        </h1>
                    </div>
                </div>
                <ul className="mt-8 flex flex-col gap-4">
                    {items.map((item) => (
                        <li key={item.id}>
                            <img src={item.image_url} alt={item.name} />
                            <h2>{item.name}</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateItem(item.id, item.quantity - 1)}
                                    disabled={item.quantity === 1}>
                                    −
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateItem(item.id, item.quantity + 1)}>
                                    +
                                </button>
                            </div>
                            <h3>{item.price}</h3>
                            <button onClick={() => removeItem(item.id)}>x</button>
                        </li>
                    ))}
                </ul>

                <p className="mt-8 text-lg">Total: {total.toFixed(2)} TL</p>
            </main>
        </div>
    );
}