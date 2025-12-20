// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// User/Client Pages
import Menu from "./pages/user/menu";
import Cart from "./pages/user/cart";
import Checkout from "./pages/user/checkout";
import Confirmation from "./pages/user/confirmation";

// Admin Pages
import AdminDashboard from "./pages/admin/dashboard";
import AdminLogin from "./pages/admin/login";
import QRGenerator from "./pages/admin/QRgenerator";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* The Navbar will show on every page */}
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Navigate to="/menu" />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/qr" element={<QRGenerator />} />
          </Routes>
        </main>

        {/* The Footer will show on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
