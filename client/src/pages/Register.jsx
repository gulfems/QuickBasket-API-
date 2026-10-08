import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';


export const Register = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ email, phone, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            navigate('/login');
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
                <h1 className="text-3xl tracking-tight text-center">
                    Register
                </h1>
                <p className="text-sm text-center mt-2">
                    Create your account.
                </p>
                <form onSubmit={handleRegister} className="mt-12 flex flex-col gap-4">
                    {
                        error && (
                            <p role="alert" className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 text-sm">
                                {error}
                            </p>
                        )
                    }
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 text-sm uppercase tracking-wider border border-border rounded-md px-6 py-3">
                        {loading ? 'Registering' : 'Register'}
                    </button>
                    <GoogleLogin
                        onSuccess={handleGoogle}
                        onError={() => setError('Google sign-in failed')}
                    />
                    <p className="font-body text-sm text-muted text-center mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-periwinkle hover:text-ice transition-colors">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

