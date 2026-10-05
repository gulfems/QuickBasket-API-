import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';


export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        let url = `${import.meta.env.VITE_API_URL}/api/products`;
        if (category) {
            url += `?category=${category}`;
        }
        const fetchProducts = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not load products');
                }
                setProducts(data.products);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [category]);

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
            </main>
        </div>
    );
}