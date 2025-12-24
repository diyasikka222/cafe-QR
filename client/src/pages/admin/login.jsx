import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Removed Axios since we are doing local verification
import {
  UtensilsCrossed,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Using a high-quality, moody kitchen background image
  const bgImage = "/images/loginBg.png";

  /* =========================================
       1. REVERSE CHECK: Redirect if already logged in
       ========================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a small network delay for better UX (optional)
    setTimeout(() => {
      /* =========================================
         2. LOCAL AUTH LOGIC (No Database)
         ========================================= */

      // Access Environment Variables (Vite approach)
      // If using Create React App, use process.env.REACT_APP_ADMIN_EMAIL
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

      if (formData.email === adminEmail && formData.password === adminPass) {
        // Success: Set a static dummy token to satisfy the Dashboard auth check
        localStorage.setItem("token", "admin-static-secure-token");
        navigate("/admin/dashboard");
      } else {
        // Failure
        setError("Invalid credentials. Please check your email and password.");
        setIsLoading(false);
      }
    }, 1000); // 1 second delay
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0f1115]/90 z-0"></div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1a1d23] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative z-10 backdrop-blur-sm bg-opacity-95">
        {/* Brand Header */}
        <div className="text-center mb-10">
          {/* FIXED: Removed 'transform rotate-3' to straighten the logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mx-auto mb-6">
            <UtensilsCrossed size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
            Manesar <span className="text-orange-500">Cafe</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
            Admin Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
                size={20}
              />
              <input
                type="email"
                name="email"
                placeholder="admin@cafe.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0f1115] border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
                size={20}
              />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0f1115] border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-orange-500 hover:text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isLoading ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>
                Enter Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">
            ManesarCafe v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
