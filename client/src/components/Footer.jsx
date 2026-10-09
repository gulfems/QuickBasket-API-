import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-ink text-white mt-16">
            <div className="max-w-6xl mx-auto px-6 py-12">

                <div className="grid gap-10 md:grid-cols-3">

                    <div>
                        <div className="flex items-center gap-2">
                            <img src="/minilogocuk.png" alt="QuickBasket" className="h-8 w-8" />
                            <span className="font-display text-2xl text-volt">quickbasket</span>
                        </div>
                        <p className="mt-3 text-sm text-white/60">Squeezing the wait out of grocery shopping.</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-volt mb-3">Shop</p>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link to="/" className="text-white/70 hover:text-white">Home</Link></li>
                            <li><Link to="/products" className="text-white/70 hover:text-white">All products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-volt mb-3">Your account</p>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link to="/orders" className="text-white/70 hover:text-white">Orders</Link></li>
                            <li><Link to="/cart" className="text-white/70 hover:text-white">Cart</Link></li>
                            <li><Link to="/account" className="text-white/70 hover:text-white">Account</Link></li>
                        </ul>
                    </div>

                </div>

                <p className="mt-10 pt-6 border-t border-white/10 text-xs text-white/50">
                    © 2026 QuickBasket · Built by {''}
                    <a href="https://github.com/gulfems" target="_blank" rel="noreferer" className="text-volt hover:underline">
                        gulfems
                    </a>
                </p>

            </div>
        </footer>
    );
}