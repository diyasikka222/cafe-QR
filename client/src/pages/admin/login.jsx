import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Using a high-quality, moody kitchen background image from Unsplash
    const bgImage = "/images/loginBg.png";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (formData.email.includes('admin') && formData.password === 'admin123') {
                navigate('/admin/dashboard');
            } else {
                setError('Invalid credentials. Try email: "admin@cafe.com" & pass: "admin123"');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        // 1. Updated Main Container to include background image styles
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >

            {/* 2. NEW: Dark Overlay layer to ensure text readability over the photo */}
            <div className="absolute inset-0 bg-[#0f1115]/90 z-0"></div>

            {/* Background Decoration Blobs (Optional: keep for extra color pop) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Login Card - z-10 ensures it sits above the background and overlay */}
            <div className="w-full max-w-md bg-[#1a1d23] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative z-10 backdrop-blur-sm bg-opacity-95">

                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mx-auto mb-6 transform rotate-3">
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
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
                            <span className="animate-pulse">Authenticating...</span>
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
                        CafePro System v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;