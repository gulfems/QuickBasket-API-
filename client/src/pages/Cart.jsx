import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Cart = () => {
    const { items, loading, error, updateItem, removeItem } = useCart();

    if (loading) return (<p>Loading your cart</p>);
    if (error) return (<p>{error}</p>);
    if (items.length === 0) return (<main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Your basket is empty</h1>
        <p className="mt-2 text-muted">Fill it up, we'll bring it over.</p>
        <Link to="/products" className="inline-block mt-6 bg-volt hover:bg-volt-dark rounded-full px-6 py-3 font-semibold">
            Start shopping here
        </Link>
    </main>
    );

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <div className="min-h-screen">
            <main className="max-w-6xl mx-auto px-6 py-12">


                <h1 className="font-display text-3xl">
                    Your cart
                </h1>
                <div className="mt-8 grid md:grid-cols-3 gap-8 items-start">
                    <ul className="md:col-span-2 flex flex-col gap-3">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center gap-4 bg-white border border-line rounded-2xl p-3">
                                <img src={item.image_url} alt={item.name} className="h-20 w-20 object-contain" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium line-clamp-2">{item.name}</p>
                                    <p className="text-sm text-muted">{Number(item.price).toFixed(2)} TL</p>
                                </div>
                                <div className="flex items-center gap-3 border border-line rounded-full px-2 py-1">
                                    <button
                                        onClick={() => updateItem(item.id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                        className="h-8 w-8 rounded-full hover:bg-volt font-semibold disabled:opacity-30"
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                                        className="h-8 w-8 rounded-full hover:bg-volt font-semibold disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="w-24 text-right font-semibold">{(Number(item.price) * item.quantity).toFixed(2)} TL</p>
                                <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-600 px-2">x</button>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-white border border-line rounded-2xl p-6 md:sticky md:top-28">
                        <h2 className="font-display text-xl">Summary</h2>

                        <div className="mt-4 flex justify-between">
                            <span>Subtotal</span>
                            <span>{total.toFixed(2)} TL</span>
                        </div>

                        <div className="mt-2 flex justify-between">
                            <span>Delivery</span>
                            <span>45.00 TL</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-line flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{(total + 45).toFixed(2)} TL</span>
                        </div>

                        {total < 200 && (
                            <p className="mt-3 text-sm text-red-600">
                                Add {(200 - total).toFixed(2)} TL more to order
                            </p>
                        )}

                        <Link
                            to="/checkout"
                            className="mt-6 block text-center bg-volt hover:bg-volt-dark rounded-full px-6 py-3 font-semibold">
                            Go to checkout
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}