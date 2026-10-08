import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            login(data.token);
            navigate('/');
        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async (credentialResponse) => {
        setError(null);
        setLoading(true);

        const { credential } = credentialResponse;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            login(data.token);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };




    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl tracking-tight text-center">
                    Login
                </h1>
                <p className="text-sm text-center mt-2">
                    Login and fill your basket
                </p>
                <form onSubmit={handleLogin} className="mt-12 flex flex-col gap-4">
                    {error && (<p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm"
                    >
                        {error}
                    </p>)}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        className="w-full border border-border rounded-md px-4 py-3"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full border border-border rounded-md px-4 py-3"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 text-sm uppercase tracking-wider border border-border rounded-md px-6 py-3">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => setError('Google sign-in failed')}
                />
                <p className="font-body text-sm text-muted text-center mt-8">
                    Need an account?{' '}
                    <Link to="/register" className="text-periwinkle hover:text-ice transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
