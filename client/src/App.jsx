import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import AdminLogin from './pages/admin/Login'; // <--- New Import
import AdminDashboard from './pages/admin/dashboard';
import QRGenerator from './pages/admin/QRGenerator';
import MenuEditor from './pages/admin/menuEditor';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#0f1115]">
                <Routes>
                    {/* ROOT REDIRECT: Send users to Login first */}
                    <Route path="/" element={<Navigate to="/admin/login" />} />

                    {/* AUTH ROUTE */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* PROTECTED ADMIN ROUTES */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/qr-generator" element={<QRGenerator />} />
                    <Route path="/admin/menu-editor" element={<MenuEditor />} />

                    {/* FALLBACK */}
                    <Route path="*" element={<div className="text-white p-10">404 - Page Not Found</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;