import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const { addItem } = useCart();

    useEffect(() => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        params.set('limit', 20);
        params.set('offset', offset);

        const url = `${import.meta.env.VITE_API_URL}/api/products?${params}`;
        const fetchProducts = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not load products');
                }
                if (offset === 0) {
                    setProducts(data.products);
                } else {
                    setProducts((prev) => [...prev, ...data.products]);
                }
                setHasMore(data.products.length === 20);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [category, search, offset]);

    useEffect(() => {
        setOffset(0);
    }, [category, search]);


    if (loading) return (<p>Products are loading</p>);
    if (error) return (<p>{error}</p>);

    return (
        <div className="min-h-screen">
            <main className="max-w-6xl mx-auto px-6 py-12">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="font-display text-3xl">Products</h1>
                    {category && (
                        <Link
                            to="/products"
                            className="text-sm font-medium rounded-full border border-line px-4 py-2 hover:bg-volt hover:border-volt">
                            ← All products
                        </Link>
                    )}
                    <input
                        type="text"
                        value={search || ''}
                        onChange={(e) => setSearchParams({ search: e.target.value })}
                        placeholder="Search products"
                        className="w-full sm:max-w-sm rounded-full border border-line px-5 py-3 focus:outline-none focus:ring-2 focus:ring-volt" />
                </div>

                <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <li key={product.id} className="relative">
                            <Link
                                to={`/products/${product.id}`}
                                className="block bg-white border border-line rounded-2xl p-3 hover:shadow-md transition">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full aspect-square object-contain" />
                                <p className="mt-3 text-sm font-medium line-clamp-2">{product.name}</p>
                                <p className="mt-1 font-semibold">{Number(product.price).toFixed(2)} TL</p>
                            </Link>
                            <button
                                onClick={() => addItem(product.id, 1)}
                                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-volt hover:bg-volt-dark text-xl font-semibold shadow-sm">
                                +
                            </button>
                        </li>
                    ))}
                </ul>

                {hasMore && (
                    <button
                        onClick={() => setOffset(offset + 20)}
                        className="mt-10 mx-auto block bg-ink text-volt rounded-full px-6 py-3 font-semibold hover:bg-ink/85">
                        Load more
                    </button>
                )}
            </main>
        </div>
    );
}