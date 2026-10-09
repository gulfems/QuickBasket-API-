import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export const NavBar = () => {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="w-full bg-volt sticky top-0 z-10">
            <nav className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between gap-8">

                <NavLink to="/" className="flex items-center gap-2">
                    <img src="/logotransparent.png" alt="QuickBasket" className="h-17 w-17" />
                    <span className="font-display text-4xl">quickbasket</span>
                </NavLink>

                {user ? (
                    <div className="flex items-center gap-6">
                        <NavLink to="/orders" className="text-sm font-medium text-ink/70 hover:text-ink">
                            Orders
                        </NavLink>
                        <NavLink to="/account" className="text-sm font-medium text-ink/70 hover:text-ink">
                            Account
                        </NavLink>
                        <span className="hidden sm:inline text-sm text-ink/70">{user.email}</span>
                        <button onClick={logout} className="text-sm font-medium text-ink/70 hover:text-ink">
                            Logout
                        </button>
                        <NavLink
                            to="/cart"
                            className="bg-ink text-volt hover:bg-ink/85 rounded-full px-5 py-3 text-sm font-semibold">
                            Cart
                            <span className="ml-2 bg-volt text-ink rounded-full px-2 py-0.5 text-xs">{count}</span>
                        </NavLink>
                    </div>
                ) : (
                    <div className="flex items-center gap-6">
                        <NavLink to="/login" className="text-sm font-medium hover:text-ink/70">
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className="bg-ink text-volt hover:bg-ink/85 rounded-full px-5 py-3 text-sm font-semibold">
                            Register
                        </NavLink>
                    </div>
                )}

            </nav>
        </header>
    );
}