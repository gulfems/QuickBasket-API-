import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const NavBar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="w-full border-b border-border">
            <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                <NavLink to="/">QuickBasket</NavLink>
                {user ? (
                    <>
                        <span>{user.email}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </nav>
        </header>
    )
}