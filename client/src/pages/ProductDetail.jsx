import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setProduct(data.product);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return (<p>Product is loading...</p>);
    if (error) return (<p>{error}</p>);

    return (
        <div className="min-h-screen">
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="bg-white border border-line rounded-3xl p-8">
                        <img src={product.image_url} alt={product.name} className="w-full aspect-square object-contain" />
                    </div>
                    <div>
                        <Link to="/products" className="text-sm text-muted hover:text-ink">← All products</Link>
                        <h1 className="mt-4 font-display text-4xl leading-tight">{product.name}</h1>
                        <p className="mt-3 text-muted">{product.description}</p>
                        <p className="mt-6 text-3xl font-semibold">{Number(product.price).toFixed(2)} TL</p>
                        <p className={`mt-2 text-sm ${product.quantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                            {product.quantity > 0 ? 'In stock' : 'Out of stock'}
                        </p>
                        <button
                            onClick={() => addItem(product.id, 1)}
                            disabled={product.quantity === 0}
                            className="mt-8 bg-volt hover:bg-volt-dark rounded-full px-8 py-4 font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                            Add to cart
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
