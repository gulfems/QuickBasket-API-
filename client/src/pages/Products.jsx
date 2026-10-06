import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';


export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const category = searchParams.get('category');
    const search = searchParams.get('search');


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
            <main className="mx-auto px-6 py-24">

                <div className="flex items-center justify-center gap-24">
                    <div>
                        <h1 className="text-4xl tracking-tight">
                            Products
                        </h1>
                    </div>
                </div>

                <input
                    type="text"
                    value={search || ''}
                    onChange={(e) => setSearchParams({ search: e.target.value })}
                    placeholder="Search products"
                    className="border rounded-md px-4 py-2" />


                <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <li key={product.id}>
                            <Link
                                to={`/products/${product.id}`}
                                className="block border border-border rounded-md p-6">
                                <div className="flex items-baseline justify-between gap-4">
                                    <h2 className="text-base">
                                        {product.name}
                                    </h2>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                {hasMore && (
                    <button
                        onClick={() => setOffset(offset + 20)}
                        className="mt-8 border rounded-md px-6 py-2">
                        Load more
                    </button>
                )}
            </main>
        </div>
    );
}