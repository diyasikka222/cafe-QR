// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import AdminNavbar from "../../components/admin/adminNavbar.jsx";
// import { CheckCircle2, IndianRupee, Users, ChefHat, History, Zap } from "lucide-react";
//
// // Initialize Socket
// const socket = io("http://localhost:5001");
//
// const AdminDashboard = () => {
//     // STATE
//     const [orders, setOrders] = useState([]);
//     const [activeTab, setActiveTab] = useState("active"); // 'active' or 'history'
//
//     /* ===============================
//          FETCH + SOCKET LISTENERS
//       =============================== */
//     useEffect(() => {
//         // Initial fetch
//         axios
//             .get("http://localhost:5001/api/orders")
//             .then((res) => setOrders(res.data))
//             .catch(console.error);
//
//         // New order from menu
//         socket.on("new-order", (order) => {
//             setOrders((prev) => [order, ...prev]);
//         });
//
//         // Order status updated
//         socket.on("order-updated", (updatedOrder) => {
//             setOrders((prev) =>
//                 // We keep served orders in state now, so we can show them in History tab
//                 prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
//             );
//         });
//
//         return () => {
//             socket.off("new-order");
//             socket.off("order-updated");
//         };
//     }, []);
//
//     /* ===============================
//          CALCULATIONS (REAL-TIME)
//       =============================== */
//
//     // 1. Separate Active (New/Preparing) from History (Served)
//     const activeOrders = useMemo(() =>
//             orders.filter(o => o.status !== "Served"),
//         [orders]);
//
//     const servedOrders = useMemo(() =>
//             orders.filter(o => o.status === "Served"),
//         [orders]);
//
//     // 2. Calculate Revenue (Sum of all orders in list)
//     const totalRevenue = useMemo(() =>
//             orders.reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0),
//         [orders]);
//
//     // 3. Calculate Unique Active Tables
//     const activeTablesCount = useMemo(() => {
//         const uniqueTables = new Set(activeOrders.map(o => o.tableNumber));
//         return uniqueTables.size;
//     }, [activeOrders]);
//
//     // Determine which list to show based on Tab
//     const displayedOrders = activeTab === "active" ? activeOrders : servedOrders;
//
//     /* ===============================
//          UPDATE STATUS (API)
//       =============================== */
//     const updateStatus = async (id) => {
//         try {
//             await axios.patch(`http://localhost:5001/api/orders/${id}`);
//         } catch (err) {
//             console.error("Error updating order:", err);
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
//             {/* FEATURE: Admin Navbar */}
//             <AdminNavbar />
//
//             <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
//
//                 {/* FEATURE: Performance Analytics Strip (Updated Columns & Real Data) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
//                     <StatCard
//                         icon={<IndianRupee className="text-emerald-500" />}
//                         label="Revenue Today"
//                         value={`₹${totalRevenue.toLocaleString()}`} // Real-time Data
//                     />
//                     <StatCard
//                         icon={<ChefHat className="text-orange-500" />}
//                         label="Active Orders"
//                         value={activeOrders.length} // Real-time Data
//                     />
//                     <StatCard
//                         icon={<Users className="text-purple-500" />}
//                         label="Active Tables"
//                         value={activeTablesCount} // Real-time Data
//                     />
//                 </div>
//
//                 {/* FEATURE: Header with Live Pulse */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
//                     <div>
//                         <h1 className="text-4xl font-black text-white tracking-tight">
//                             KITCHEN{" "}
//                             <span className="text-orange-500 underline decoration-4 underline-offset-8">
//                                 COMMAND
//                             </span>
//                         </h1>
//                         <p className="text-slate-500 font-medium mt-2 italic px-1 text-sm border-l-2 border-orange-500/30 mb-6">
//                             Monitoring incoming orders & kitchen throughput
//                         </p>
//
//                         {/* NEW: Active/Inactive Tabs (Styled like Navbar) */}
//                         <div className="inline-flex items-center bg-[#1a1d23] rounded-2xl p-1 border border-slate-800">
//                             <button
//                                 onClick={() => setActiveTab("active")}
//                                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
//                                     activeTab === "active"
//                                         ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
//                                         : "text-slate-400 hover:text-white hover:bg-slate-800"
//                                 }`}
//                             >
//                                 <Zap size={16} />
//                                 Live Orders
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab("history")}
//                                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
//                                     activeTab === "history"
//                                         ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
//                                         : "text-slate-400 hover:text-white hover:bg-slate-800"
//                                 }`}
//                             >
//                                 <History size={16} />
//                                 History
//                             </button>
//                         </div>
//                     </div>
//
//                     <div className="flex items-center gap-4 bg-[#1a1d23] py-2 px-6 rounded-2xl border border-slate-800 shadow-2xl mb-1">
//                         <div className="relative flex h-3 w-3">
//                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
//                             <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
//                         </div>
//                         <span className="text-xs font-black tracking-[0.2em] uppercase text-slate-300">
//                             Live Server
//                         </span>
//                     </div>
//                 </div>
//
//                 {/* FEATURE: Interactive Order Grid */}
//                 {displayedOrders.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//                         {displayedOrders.map((order) => (
//                             <OrderCard
//                                 key={order._id}
//                                 order={order}
//                                 isHistory={activeTab === "history"}
//                                 onComplete={() => updateStatus(order._id)}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800 rounded-[3rem] bg-[#16191e]/50">
//                         <CheckCircle2 size={48} className="text-slate-700 mb-4" />
//                         <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">
//                             {activeTab === "active" ? "No active orders" : "No order history"}
//                         </p>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };
//
// /* ===============================
//    SUB-COMPONENTS
// =============================== */
//
// // Sub-component: Stats Card
// const StatCard = ({ icon, label, value }) => (
//     <div className="bg-[#1a1d23] border border-slate-800 p-6 rounded-[2.5rem] shadow-xl hover:border-slate-700 transition-all">
//         <div className="flex items-center gap-4">
//             <div className="p-3 bg-slate-800/50 rounded-2xl">{icon}</div>
//             <div>
//                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
//                     {label}
//                 </p>
//                 <p className="text-2xl font-black text-white">{value}</p>
//             </div>
//         </div>
//     </div>
// );
//
// // Sub-component: Order Card
// const OrderCard = ({ order, onComplete, isHistory }) => (
//     <div className={`group relative bg-[#1a1d23] rounded-[2.5rem] overflow-hidden border transition-all duration-500 shadow-2xl ${
//         isHistory ? "border-slate-800 opacity-75 grayscale-[0.5]" : "border-slate-800 hover:border-orange-500/40"
//     }`}>
//         {/* Dynamic Status Indicator */}
//         <div
//             className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${
//                 order.status === "New" ? "bg-blue-500" :
//                     order.status === "Served" ? "bg-emerald-600" : "bg-orange-500"
//             }`}
//         ></div>
//
//         <div className="p-8">
//             <div className="flex justify-between items-start mb-8">
//                 <div>
//                     <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
//                         Table Number
//                     </span>
//                     <h2 className="text-5xl font-black text-white leading-tight">
//                         {order.tableNumber}
//                     </h2>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase">
//                         #{order._id.slice(-6)}
//                     </p>
//                     <span
//                         className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
//                             order.status === "New"
//                                 ? "bg-blue-500/10 text-blue-400"
//                                 : order.status === "Served"
//                                     ? "bg-emerald-500/10 text-emerald-400"
//                                     : "bg-orange-500/10 text-orange-400"
//                         }`}
//                     >
//                         ● {order.status}
//                     </span>
//                 </div>
//             </div>
//
//             <div className="space-y-4 mb-10 min-h-[140px]">
//                 {order.items.map((item, i) => (
//                     <div
//                         key={i}
//                         className="flex justify-between items-center group/item border-b border-slate-800/30 pb-3 last:border-0"
//                     >
//                         <div className="flex items-center gap-4">
//                             <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 font-black text-sm border border-orange-500/20">
//                                 {item.quantity}
//                             </span>
//                             <span className="font-bold text-slate-300 group-hover/item:text-white transition-colors">
//                                 {item.name}
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//
//             <div className="pt-8 border-t border-slate-800/50 flex justify-between items-center">
//                 <div>
//                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
//                         Total Bill
//                     </p>
//                     <span className="text-3xl font-black text-white">₹{order.total}</span>
//                 </div>
//
//                 {/* Only show Action Button if not served */}
//                 {!isHistory && (
//                     <button
//                         onClick={onComplete}
//                         className={`px-8 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
//                             order.status === "New"
//                                 ? "bg-orange-500 text-white hover:bg-orange-400 shadow-orange-500/20"
//                                 : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20"
//                         }`}
//                     >
//                         {order.status === "New" ? "Start Prep" : "Mark Served"}
//                     </button>
//                 )}
//
//                 {isHistory && (
//                     <div className="flex items-center gap-2 text-emerald-500">
//                         <CheckCircle2 size={24} />
//                         <span className="font-bold text-sm uppercase tracking-wider">Completed</span>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
// );
//
// export default AdminDashboard;



import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AdminNavbar from "../../components/admin/adminNavbar.jsx";
import { CheckCircle2, IndianRupee, Users, ChefHat, History, Zap, Wallet, Receipt } from "lucide-react";

// Initialize Socket
const socket = io("http://localhost:5001");

const AdminDashboard = () => {
    // STATE
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("active"); // 'active' or 'history'

    /* ===============================
         FETCH + SOCKET LISTENERS
      =============================== */
    useEffect(() => {
        axios
            .get("http://localhost:5001/api/orders")
            .then((res) => setOrders(res.data))
            .catch(console.error);

        socket.on("new-order", (order) => {
            setOrders((prev) => [order, ...prev]);
        });

        socket.on("order-updated", (updatedOrder) => {
            setOrders((prev) =>
                prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
        });

        return () => {
            socket.off("new-order");
            socket.off("order-updated");
        };
    }, []);

    /* ===============================
         CALCULATIONS & FILTERING
      =============================== */

    // 1. ACTIVE: Status is NOT Served OR Payment is Pending
    // This keeps the order on the main screen until the customer pays and leaves.
    const activeOrders = useMemo(() =>
            orders.filter(o => o.status !== "Served" || (o.paymentStatus === "Pending" || !o.paymentStatus)),
        [orders]);

    // 2. HISTORY: Status is Served AND Payment is Paid
    const servedOrders = useMemo(() =>
            orders.filter(o => o.status === "Served" && o.paymentStatus === "Paid"),
        [orders]);

    // 3. REVENUE: Sum of only PAID orders
    const totalRevenue = useMemo(() =>
            orders
                .filter(o => o.paymentStatus === "Paid")
                .reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0),
        [orders]);

    // 4. PENDING BILLS: Sum of orders served but NOT paid
    const pendingRevenue = useMemo(() =>
            orders
                .filter(o => o.status === "Served" && (o.paymentStatus === "Pending" || !o.paymentStatus))
                .reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0),
        [orders]);

    // 5. ACTIVE TABLES
    const activeTablesCount = useMemo(() => {
        const uniqueTables = new Set(activeOrders.map(o => o.tableNumber));
        return uniqueTables.size;
    }, [activeOrders]);

    const displayedOrders = activeTab === "active" ? activeOrders : servedOrders;

    /* ===============================
         ACTIONS
      =============================== */

    // Advance Order Status (New -> Preparing -> Served)
    const updateStatus = async (id) => {
        try {
            await axios.patch(`http://localhost:5001/api/orders/${id}`);
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    // Mark Order as Paid
    const markAsPaid = async (id) => {
        try {
            // Sending specific payload to update payment status
            await axios.patch(`http://localhost:5001/api/orders/${id}`, {
                paymentStatus: "Paid"
            });
            // Optimistic UI update (optional, socket usually handles this)
            setOrders(prev => prev.map(o => o._id === id ? { ...o, paymentStatus: "Paid" } : o));
        } catch (err) {
            console.error("Error updating payment:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
            <AdminNavbar />

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">

                {/* ANALYTICS STRIP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<IndianRupee className="text-emerald-500" />}
                        label="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString()}`}
                        subValue="Collected"
                    />
                    <StatCard
                        icon={<Receipt className="text-yellow-500" />}
                        label="Pending Bills"
                        value={`₹${pendingRevenue.toLocaleString()}`}
                        subValue="Not Paid Yet"
                    />
                    <StatCard
                        icon={<ChefHat className="text-orange-500" />}
                        label="Kitchen Load"
                        value={activeOrders.filter(o => o.status !== "Served").length}
                        subValue="Cooking Now"
                    />
                    <StatCard
                        icon={<Users className="text-purple-500" />}
                        label="Live Tables"
                        value={activeTablesCount}
                        subValue="Occupied"
                    />
                </div>

                {/* HEADER & TABS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            KITCHEN <span className="text-orange-500 underline decoration-4 underline-offset-8">COMMAND</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 italic px-1 text-sm border-l-2 border-orange-500/30 mb-6">
                            Manage orders, serve food, and track payments
                        </p>

                        <div className="inline-flex items-center bg-[#1a1d23] rounded-2xl p-1 border border-slate-800">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    activeTab === "active"
                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                            >
                                <Zap size={16} />
                                Active & Unpaid
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    activeTab === "history"
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                            >
                                <History size={16} />
                                Paid History
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#1a1d23] py-2 px-6 rounded-2xl border border-slate-800 shadow-2xl mb-1">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </div>
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-slate-300">
                            System Live
                        </span>
                    </div>
                </div>

                {/* ORDER GRID */}
                {displayedOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {displayedOrders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                onUpdateStatus={() => updateStatus(order._id)}
                                onMarkPaid={() => markAsPaid(order._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800 rounded-[3rem] bg-[#16191e]/50">
                        <CheckCircle2 size={48} className="text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">
                            {activeTab === "active" ? "No active orders" : "No payment history found"}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

/* ===============================
   SUB-COMPONENTS
=============================== */

const StatCard = ({ icon, label, value, subValue }) => (
    <div className="bg-[#1a1d23] border border-slate-800 p-6 rounded-[2.5rem] shadow-xl hover:border-slate-700 transition-all">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800/50 rounded-2xl">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black text-white leading-none">{value}</p>
                {subValue && <p className="text-[10px] text-slate-500 mt-1 font-medium">{subValue}</p>}
            </div>
        </div>
    </div>
);

const OrderCard = ({ order, onUpdateStatus, onMarkPaid }) => {
    // Determine Payment Status (Default to Pending if undefined)
    const isPaid = order.paymentStatus === "Paid";
    const isServed = order.status === "Served";

    return (
        <div className={`group relative bg-[#1a1d23] rounded-[2.5rem] overflow-hidden border transition-all duration-500 shadow-2xl ${
            isPaid && isServed ? "border-emerald-900/50 opacity-75 grayscale-[0.3]" : "border-slate-800 hover:border-orange-500/40"
        }`}>
            {/* Status Strip */}
            <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${
                order.status === "New" ? "bg-blue-500" :
                    !isServed ? "bg-orange-500" :
                        isPaid ? "bg-emerald-600" : "bg-yellow-500" // Yellow if Served but Unpaid
            }`}></div>

            <div className="p-8">
                {/* Header: Table & Payment Badge */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Table</span>
                        <h2 className="text-5xl font-black text-white leading-tight">{order.tableNumber}</h2>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        {/* Payment Badge */}
                        <span className={`flex items-center gap-1 px-3 py-1 mb-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isPaid
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                            {isPaid ? <CheckCircle2 size={10} /> : <Wallet size={10} />}
                            {isPaid ? "PAID" : "UNPAID"}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === "New" ? "bg-blue-500/10 text-blue-400" :
                                !isServed ? "bg-orange-500/10 text-orange-400" :
                                    "bg-yellow-500/10 text-yellow-400"
                        }`}>
                            ● {order.status}
                        </span>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-10 min-h-[140px]">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group/item border-b border-slate-800/30 pb-3 last:border-0">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-black text-sm">
                                    {item.quantity}
                                </span>
                                <span className="font-bold text-slate-300 group-hover/item:text-white transition-colors">
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer: Bill & Actions */}
                <div className="pt-8 border-t border-slate-800/50 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bill Amount</p>
                        <span className="text-3xl font-black text-white">₹{order.total}</span>
                    </div>

                    {/* BUTTON LOGIC */}
                    {!isServed ? (
                        // 1. Kitchen Workflow (New -> Preparing -> Served)
                        <button
                            onClick={onUpdateStatus}
                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                                order.status === "New"
                                    ? "bg-orange-500 text-white hover:bg-orange-400 shadow-orange-500/20"
                                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"
                            }`}
                        >
                            {order.status === "New" ? "Start Prep" : "Serve Food"}
                        </button>
                    ) : !isPaid ? (
                        // 2. Payment Workflow (Served -> Paid)
                        <button
                            onClick={onMarkPaid}
                            className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <Wallet size={16} /> Collect Cash
                        </button>
                    ) : (
                        // 3. Completed State
                        <div className="flex items-center gap-2 text-slate-500">
                            <CheckCircle2 size={24} className="text-emerald-600" />
                            <span className="font-bold text-xs uppercase">Completed</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;