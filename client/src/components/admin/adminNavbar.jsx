import React from 'react';
// Added useLocation for active state and useNavigate for logout
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, QrCode, UtensilsCrossed, LogOut, Bell, Menu } from 'lucide-react';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Live Orders', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
        { name: 'QR Generator', icon: <QrCode size={18} />, path: '/admin/qr-generator' },
        { name: 'Menu Editor', icon: <Menu size={18} />, path: '/admin/menu-editor' },
    ];

    const handleLogout = () => {
        // Here you would clear authentication tokens if you had them
        // localStorage.removeItem('token');
        navigate('/admin/login');
    };

    return (
        <nav className="bg-[#1a1d23] border-b border-slate-800 px-6 py-3 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">

                {/* BRAND LOGO */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <UtensilsCrossed size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white leading-none uppercase">
                            Manesar <span className="text-orange-500">Cafe</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Panel</p>
                    </div>
                </div>

                {/* MIDDLE LINKS (DESKTOP) */}
                <div className="hidden md:flex items-center bg-[#0f1115] rounded-2xl p-1 border border-slate-800">
                    {navItems.map((item) => {
                        // Check if the current URL matches this link
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-4">
                    {/* Alerts/Notifications */}
                    <button className="relative p-2.5 bg-slate-800/50 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all border border-slate-800">
                        <Bell size={20} />
                        {/* Notification Dot */}
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-[#1a1d23] rounded-full animate-pulse"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors group"
                    >
                        <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} />
                        </div>
                        <span className="hidden lg:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;