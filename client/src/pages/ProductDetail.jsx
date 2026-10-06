import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


export const ProductDetail = () => {
    const { id } = useParams();

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
            <main className="mx-auto px-6 py-24">
                <div className="flex items-center justify-start gap-24">
                    <div>
                        <h1>{product.name}</h1>
                        <h3>{product.description}</h3>
                        <h3>{product.price}</h3>
                        <h4>quantity: {product.quantity}</h4>
                    </div>
                </div>
            </main>
        </div>
    );
};
