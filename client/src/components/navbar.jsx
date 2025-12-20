import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const { cart } = useCart();
    const location = useLocation();

    // Don't show simple navbar on Admin pages
    if (location.pathname.startsWith('/admin')) {
        return (
            <nav className="p-4 bg-black text-white flex justify-between items-center">
                <h1 className="font-black text-xl">CAFE ADMIN</h1>
                <Link to="/" className="text-xs bg-gray-800 px-3 py-1 rounded">Exit Dashboard</Link>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center">
            <Link to="/menu" className="text-2xl font-black tracking-tighter italic">
                CAFE<span className="text-orange-500">QR</span>
            </Link>

            <Link to="/cart" className="relative p-2 bg-gray-100 rounded-xl">
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {cart.length}
          </span>
                )}
            </Link>
        </nav>
    );
};

export default Navbar;