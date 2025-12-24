import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/adminNavbar.jsx";
import {
  CheckCircle2,
  IndianRupee,
  Users,
  ChefHat,
  History,
  Zap,
  Wallet,
  Receipt,
  Calendar,
  Clock,
  Filter,
  Search,
} from "lucide-react";

// Initialize Socket
const socket = io("http://localhost:5001");

const AdminDashboard = () => {
  const navigate = useNavigate();

  // STATE
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // HISTORY FILTER STATE
  const [selectedMonth, setSelectedMonth] = useState("ALL"); // Format: "YYYY-MM" or "ALL"
  const [searchQuery, setSearchQuery] = useState("");

  /* ===============================
           AUTH CHECK
     =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  /* ===============================
           FETCH + SOCKET
     =============================== */
  useEffect(() => {
    if (isCheckingAuth) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5001/api/orders")
      .then((res) => setOrders(res.data))
      .catch(console.error);

    socket.on("new-order", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("order-updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)),
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-updated");
    };
  }, [isCheckingAuth]);

  /* ===============================
           COMPUTED DATA
     =============================== */

  // 1. ACTIVE ORDERS
  const activeOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status !== "Served" ||
          o.paymentStatus === "Pending" ||
          !o.paymentStatus,
      ),
    [orders],
  );

  // 2. RAW HISTORY (Served & Paid)
  const rawHistory = useMemo(
    () =>
      orders.filter((o) => o.status === "Served" && o.paymentStatus === "Paid"),
    [orders],
  );

  // 3. FILTERED HISTORY (Applied Month & Search)
  const filteredHistory = useMemo(() => {
    return rawHistory
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;

        const matchesMonth =
          selectedMonth === "ALL" || monthKey === selectedMonth;
        const matchesSearch =
          searchQuery === "" ||
          order.tableNumber.toString().includes(searchQuery) ||
          order._id.slice(-6).includes(searchQuery);

        return matchesMonth && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
  }, [rawHistory, selectedMonth, searchQuery]);

  // 4. AVAILABLE MONTHS FOR DROPDOWN
  const availableMonths = useMemo(() => {
    const months = new Set();
    rawHistory.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.add(key);
    });
    return Array.from(months).sort().reverse();
  }, [rawHistory]);

  // 5. STATS
  const totalRevenue = useMemo(
    () =>
      rawHistory.reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0),
    [rawHistory],
  );

  const pendingRevenue = useMemo(
    () =>
      orders
        .filter(
          (o) =>
            o.status === "Served" &&
            (o.paymentStatus === "Pending" || !o.paymentStatus),
        )
        .reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0),
    [orders],
  );

  const activeTablesCount = useMemo(() => {
    const uniqueTables = new Set(activeOrders.map((o) => o.tableNumber));
    return uniqueTables.size;
  }, [activeOrders]);

  /* ===============================
           ACTIONS
     =============================== */
  const updateStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/orders/${id}`);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/orders/${id}`, {
        paymentStatus: "Paid",
      });
      // Optimistic Update
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, paymentStatus: "Paid" } : o)),
      );
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  // HELPER: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-orange-500/30">
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
            value={activeOrders.filter((o) => o.status !== "Served").length}
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              KITCHEN{" "}
              <span className="text-orange-500 underline decoration-4 underline-offset-8">
                COMMAND
              </span>
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

        {/* =======================
            CONTENT AREA
           ======================= */}

        {activeTab === "active" ? (
          // ACTIVE ORDERS GRID
          activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onUpdateStatus={() => updateStatus(order._id)}
                  onMarkPaid={() => markAsPaid(order._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No active orders" />
          )
        ) : (
          // HISTORY TABLE VIEW
          <div className="bg-[#1a1d23] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* HISTORY TOOLBAR */}
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <History size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">Order History</h2>
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
                  {filteredHistory.length} Records
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* SEARCH */}
                <div className="relative group">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search Table / ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#0f1115] border border-slate-700 text-white text-xs font-bold rounded-xl py-2 pl-9 pr-4 outline-none focus:border-emerald-500 w-48 transition-all"
                  />
                </div>

                {/* MONTH FILTER */}
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={14}
                  />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-[#0f1115] border border-slate-700 text-white text-xs font-bold rounded-xl py-2 pl-9 pr-8 outline-none focus:border-emerald-500 cursor-pointer transition-all"
                  >
                    <option value="ALL">All Time</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              {filteredHistory.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#15171c] text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                      <th className="p-6 font-bold">Order ID / Date</th>
                      <th className="p-6 font-bold">Table</th>
                      <th className="p-6 font-bold">Items</th>
                      <th className="p-6 font-bold">Timestamps</th>
                      <th className="p-6 font-bold text-right">Total</th>
                      <th className="p-6 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredHistory.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="p-6">
                          <p className="font-mono text-xs text-slate-500 mb-1">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <Calendar size={14} className="text-slate-600" />
                            {formatFullDate(order.createdAt)}
                          </div>
                        </td>

                        <td className="p-6">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-lg border border-orange-500/20">
                            {order.tableNumber}
                          </div>
                        </td>

                        <td className="p-6">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-slate-300"
                              >
                                <span className="text-xs font-black text-slate-600 bg-slate-800 px-1.5 rounded">
                                  {item.quantity}x
                                </span>
                                <span>{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-6">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock size={12} className="text-blue-500" />
                              <span className="w-12">Placed:</span>
                              <span className="text-white font-mono">
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                            {/* Note: Assuming 'updatedAt' is roughly when it was served/completed if 'servedAt' doesn't exist */}
                            <div className="flex items-center gap-2 text-slate-400">
                              <ChefHat size={12} className="text-orange-500" />
                              <span className="w-12">Served:</span>
                              <span className="text-white font-mono">
                                {formatDate(order.updatedAt || order.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <CheckCircle2
                                size={12}
                                className="text-emerald-500"
                              />
                              <span className="w-12">Paid:</span>
                              <span className="text-white font-mono">
                                {formatDate(order.updatedAt || order.createdAt)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-6 text-right">
                          <span className="text-xl font-black text-white">
                            ₹{order.total}
                          </span>
                        </td>

                        <td className="p-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState message="No history matches filter" />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ===============================
   SUB-COMPONENTS
=============================== */

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800 rounded-[3rem] bg-[#16191e]/50">
    <CheckCircle2 size={48} className="text-slate-700 mb-4" />
    <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">
      {message}
    </p>
  </div>
);

const StatCard = ({ icon, label, value, subValue }) => (
  <div className="bg-[#1a1d23] border border-slate-800 p-6 rounded-[2.5rem] shadow-xl hover:border-slate-700 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-800/50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
        {subValue && (
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {subValue}
          </p>
        )}
      </div>
    </div>
  </div>
);

const OrderCard = ({ order, onUpdateStatus, onMarkPaid }) => {
  const isPaid = order.paymentStatus === "Paid";
  const isServed = order.status === "Served";

  return (
    <div
      className={`group relative bg-[#1a1d23] rounded-[2.5rem] overflow-hidden border transition-all duration-500 shadow-2xl ${
        isPaid && isServed
          ? "border-emerald-900/50 opacity-75 grayscale-[0.3]"
          : "border-slate-800 hover:border-orange-500/40"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${
          order.status === "New"
            ? "bg-blue-500"
            : !isServed
              ? "bg-orange-500"
              : isPaid
                ? "bg-emerald-600"
                : "bg-yellow-500"
        }`}
      ></div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
              Table
            </span>
            <h2 className="text-5xl font-black text-white leading-tight">
              {order.tableNumber}
            </h2>
          </div>
          <div className="text-right flex flex-col items-end">
            <span
              className={`flex items-center gap-1 px-3 py-1 mb-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isPaid
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {isPaid ? <CheckCircle2 size={10} /> : <Wallet size={10} />}
              {isPaid ? "PAID" : "UNPAID"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                order.status === "New"
                  ? "bg-blue-500/10 text-blue-400"
                  : !isServed
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-yellow-500/10 text-yellow-400"
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

        <div className="pt-8 border-t border-slate-800/50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Bill Amount
            </p>
            <span className="text-3xl font-black text-white">
              ₹{order.total}
            </span>
          </div>

          {!isServed ? (
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
            <button
              onClick={onMarkPaid}
              className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20 flex items-center gap-2"
            >
              <Wallet size={16} /> Collect Cash
            </button>
          ) : (
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
