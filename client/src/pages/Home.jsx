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

    return (
        <div className="min-h-screen">
            <section className="bg-volt pt-8 pb-40">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="font-display text-5xl md:text-6xl leading-tight mt-30 ml-17">Life gave you a basket.</h1>
                        <p className="ml-17 mt-4 text-lg text-ink/70 max-w-md">Fill it with 90+ fresh picks and we'll bring it over.</p>
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
            <section className="bg-white">
                <main className="max-w-6xl mx-auto px-6 py-16">


                    <div>
                        <h2 className="font-display text-3xl">
                            Categories
                        </h2>
                        <p className="mt-2 text-muted mb-15">
                            Find anything you need for your next meal.
                        </p>

                    </div>
                    {loading && <p className="mt-8 text-muted">Loading categories…</p>}
                    {error && <p className="mt-8 text-red-600">{error}</p>}

                    {!loading && !error && (
                        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link
                                        to={`/products?category=${category.id}`}
                                        className='group block bg-white rounded-xl shadow-sm hover:shadow-md pb-0'>
                                        <div className="aspect-square rounded-2xl p-6 transition group-hover:-translate-y-1">
                                            <img src={category.image_url} alt={category.name} className="w-full h-full object-contain rounded-xl" />
                                        </div>
                                        <p className="text-base font-semibold text-center">{category.name}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </section>
        </div>
    );
};

