import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { Footer } from './Footer.jsx';
export const Layout = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
}