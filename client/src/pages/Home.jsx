import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroPhotos = ['/products/7.png', '/products/13.png', '/products/31.png', '/products/58.png', '/products/26.png', '/products/41.png'];

export const Home = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                    method: 'GET',

                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Could not load categories');
                }
                setCategories(data.categories);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) return (<p>Loading categories</p>);
    if (error) return (<p>{error}</p>);

    return (
        <div className="min-h-screen">
            <section className="bg-volt pt-8 pb-40">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="font-display text-5xl md:text-6xl leading-tight mt-30 ml-17">Life gave you a basket.</h1>
                        <p className="ml-17 mt-4 text-lg text-ink/70 max-w-md">Fill it with 90+ fresh pics and we'll bring it over.</p>
                        <Link to="/products" className="inline-block mt-8 bg-ink text-volt rounded-full px-6 py-3 font-semibold ml-17 hover:bg-ink/85">Start shopping</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {heroPhotos.map((src, i) => (
                            <div
                                key={src}
                                className={`aspect-square rounded-2xl p-3 ${i % 2 === 0 ? 'bg-lemon' : 'bg-white'} ${i % 3 === 1 ? '-translate-y-4' : ''}`}>
                                <img src={src} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <main className="mx-auto px-6 py-24">

                <div className="flex items-center justify-center gap-20">
                    <div>
                        <h1 className="text-4xl tracking-tight">
                            Categories
                        </h1>
                        <p className="mt-3">
                            Find anything you need for your next meal.
                        </p>
                    </div>

                    <ul className="mt-16 grid grid-cols-5 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    to={`/products?category=${category.id}`}
                                    className='block border border-border rounded-md p-6'>
                                    <div className="flex items-baseline justify-between gap-4">
                                        <h2 className="text-lg">
                                            {category.name}
                                        </h2>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

