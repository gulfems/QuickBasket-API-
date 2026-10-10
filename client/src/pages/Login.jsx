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
        <main className="px-6 py-16 flex justify-center">
            <div className="w-full max-w-sm bg-white border border-line rounded-3xl p-8">
                <img src="/logotransparent.png" alt="" className="mx-auto h-14 w-14" />
                <h1 className="mt-4 font-display text-3xl text-center">Welcome back</h1>
                <p className="mt-2 text-sm text-muted text-center">Log in and fill your basket.</p>

                <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                        className="w-full rounded-xl border border-line px-4 py-3 focus:outline-none focus:ring-2 focus:ring-volt"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full rounded-xl border border-line px-4 py-3 focus:outline-none focus:ring-2 focus:ring-volt"
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-volt hover:bg-volt-dark rounded-full px-6 py-3 font-semibold disabled:opacity-40">
                        {loading ? 'Logging in…' : 'Log in'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-muted">
                    <span className="h-px flex-1 bg-line"></span>
                    or
                    <span className="h-px flex-1 bg-line"></span>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogle}
                        onError={() => setError('Google sign-in failed')}
                        shape="pill"
                    />
                </div>

                <p className="mt-8 text-sm text-muted text-center">
                    Need an account?{' '}
                    <Link to="/register" className="text-ink font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </main>
    );
};

