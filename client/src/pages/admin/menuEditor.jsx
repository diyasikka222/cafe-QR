import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/adminNavbar';
import { Plus, Search, Edit2, Trash2, Power, Utensils, AlertCircle } from 'lucide-react';

const MenuEditor = () => {
    // SEEDED DATA: In a real app, this would come from your Backend/Database
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: "Margherita Pizza", price: 80, category: "Main Course", available: true },
        { id: 2, name: "Iced Americano", price: 45, category: "Beverages", available: true },
        { id: 3, name: "Truffle Pasta", price: 120, category: "Main Course", available: false },
        { id: 4, name: "Garlic Bread", price: 35, category: "Sides", available: true },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    // Toggle "Sold Out" status
    const toggleAvailability = (id) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
            <AdminNavbar />

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">MENU <span className="text-orange-500">EDITOR</span></h1>
                        <p className="text-slate-500 font-medium mt-1">Manage dishes, pricing, and availability</p>
                    </div>

                    <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20">
                        <Plus size={18} /> Add New Item
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search for a dish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1d23] border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-orange-500 outline-none transition-all shadow-xl"
                    />
                </div>

                {/* Menu Table */}
                <div className="bg-[#1a1d23] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-slate-800 bg-[#16191e]">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Item Details</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Price</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                                                <Utensils size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                            <span className="px-4 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-400">
                                                {item.category}
                                            </span>
                                    </td>
                                    <td className="px-8 py-6 text-center font-black text-xl text-white">
                                        ₹{item.price}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => toggleAvailability(item.id)}
                                            className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                                                item.available
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}
                                        >
                                            <Power size={14} />
                                            {item.available ? "In Stock" : "Sold Out"}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-slate-800 hover:bg-blue-500 text-slate-400 hover:text-white rounded-lg transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20 bg-[#1a1d23] rounded-[2.5rem] mt-8 border border-dashed border-slate-800">
                        <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No items found matching "{searchTerm}"</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenuEditor;