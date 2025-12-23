import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// user
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';

//user pages
import Menu from './pages/user/menu.jsx';
import Cart from './pages/user/cart.jsx';
import Checkout from './pages/user/checkout.jsx';
import Confirmation from './pages/user/confirmation.jsx';

// Admin Pages
import AdminLogin from './pages/admin/login.jsx';
import AdminDashboard from './pages/admin/dashboard';
import QRGenerator from './pages/admin/QRgenerator.jsx'; // Fixed casing
import MenuEditor from './pages/admin/menuEditor.jsx';   // Restored missing page

// 1. Create a specific Layout for Customers so their Navbar doesn't invade Admin pages
const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar /> {/* Friend's Navbar */}
            <main className="flex-grow">
                <Outlet /> {/* This renders the child route (Menu, Cart, etc.) */}
            </main>
            <Footer /> {/* Friend's Footer */}
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* --- ADMIN ROUTES (No Navbar/Footer Wrapper) --- */}
                {/* These pages handle their own "AdminNavbar" internally */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/qr-generator" element={<QRGenerator />} />
                <Route path="/admin/menu-editor" element={<MenuEditor />} />

                {/* --- USER ROUTES (Wrapped in UserLayout) --- */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Navigate to="/menu" />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;