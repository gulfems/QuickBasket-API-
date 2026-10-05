import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

