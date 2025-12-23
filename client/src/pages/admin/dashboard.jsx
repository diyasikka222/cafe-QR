import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AdminNavbar from "../../components/admin/adminNavbar.jsx";
import { CheckCircle2, Clock, IndianRupee, Users, ChefHat } from "lucide-react";

// Initialize Socket
const socket = io("http://localhost:5001");

const AdminDashboard = () => {
    // STATE
    const [orders, setOrders] = useState([]);

    /* ===============================
         FETCH + SOCKET LISTENERS
      =============================== */
    useEffect(() => {
        // Initial fetch
        axios
            .get("http://localhost:5001/api/orders")
            .then((res) => setOrders(res.data))
            .catch(console.error);

        // New order from menu
        socket.on("new-order", (order) => {
            setOrders((prev) => [order, ...prev]);
        });

        // Order status updated
        socket.on("order-updated", (updatedOrder) => {
            setOrders((prev) =>
                prev
                    .map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
                    .filter((o) => o.status !== "Served"),
            );
        });

        return () => {
            socket.off("new-order");
            socket.off("order-updated");
        };
    }, []);

    /* ===============================
         UPDATE STATUS (API)
      =============================== */
    const updateStatus = async (id) => {
        try {
            await axios.patch(`http://localhost:5001/api/orders/${id}`);
        } catch (err) {
            console.error("Error updating order:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
            {/* FEATURE: Admin Navbar */}
            <AdminNavbar />

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                {/* FEATURE: Performance Analytics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<IndianRupee className="text-emerald-500" />}
                        label="Revenue Today"
                        value="₹12,450"
                    />
                    <StatCard
                        icon={<ChefHat className="text-orange-500" />}
                        label="Active Orders"
                        value={orders.length}
                    />
                    <StatCard
                        icon={<Clock className="text-blue-500" />}
                        label="Avg. Prep Time"
                        value="14m"
                    />
                    <StatCard
                        icon={<Users className="text-purple-500" />}
                        label="Tables Active"
                        value="8/20"
                    />
                </div>

                {/* FEATURE: Header with Live Pulse */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            KITCHEN{" "}
                            <span className="text-orange-500 underline decoration-4 underline-offset-8">
                COMMAND
              </span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 italic px-1 text-sm border-l-2 border-orange-500/30">
                            Monitoring incoming orders & kitchen throughput
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-[#1a1d23] py-2 px-6 rounded-2xl border border-slate-800 shadow-2xl">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </div>
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-slate-300">
              Live Server
            </span>
                    </div>
                </div>

                {/* FEATURE: Interactive Order Grid */}
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {orders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                onComplete={() => updateStatus(order._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800 rounded-[3rem] bg-[#16191e]/50">
                        <CheckCircle2 size={48} className="text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">
                            All orders served
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

/* ===============================
   SUB-COMPONENTS (RESTORED STYLING)
=============================== */

// Sub-component: Stats Card
const StatCard = ({ icon, label, value }) => (
    <div className="bg-[#1a1d23] border border-slate-800 p-6 rounded-[2.5rem] shadow-xl hover:border-slate-700 transition-all">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800/50 rounded-2xl">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Sub-component: Order Card
const OrderCard = ({ order, onComplete }) => (
    <div className="group relative bg-[#1a1d23] rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-orange-500/40 transition-all duration-500 shadow-2xl">
        {/* Dynamic Status Indicator */}
        <div
            className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${
                order.status === "New" ? "bg-blue-500" : "bg-orange-500"
            }`}
        ></div>

        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
            Table Number
          </span>
                    {/* Mapped order.tableNumber from backend data */}
                    <h2 className="text-5xl font-black text-white leading-tight">
                        {order.tableNumber}
                    </h2>
                </div>
                <div className="text-right">
                    {/* Showing truncated ID for cleaner look, or full ID if preferred */}
                    <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase">
                        #{order._id.slice(-6)}
                    </p>
                    <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === "New"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-orange-500/10 text-orange-400"
                        }`}
                    >
            ● {order.status}
          </span>
                </div>
            </div>

            <div className="space-y-4 mb-10 min-h-[140px]">
                {order.items.map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center group/item border-b border-slate-800/30 pb-3 last:border-0"
                    >
                        <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 font-black text-sm border border-orange-500/20">
                {item.quantity}
              </span>
                            <span className="font-bold text-slate-300 group-hover/item:text-white transition-colors">
                {item.name}
              </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-slate-800/50 flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Total Bill
                    </p>
                    <span className="text-3xl font-black text-white">₹{order.total}</span>
                </div>
                <button
                    onClick={onComplete}
                    className={`px-8 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                        order.status === "New"
                            ? "bg-orange-500 text-white hover:bg-orange-400 shadow-orange-500/20"
                            : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20"
                    }`}
                >
                    {order.status === "New" ? "Start Prep" : "Mark Served"}
                </button>
            </div>
        </div>
    </div>
);

export default AdminDashboard;