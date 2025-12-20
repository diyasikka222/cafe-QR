import React, { useState } from "react";
import { Clock, CheckCircle, CreditCard, ChevronRight } from "lucide-react"; // Optional: npm i lucide-react

const AdminDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: "#8801",
      table: "05",
      items: [
        { name: "Margherita Pizza", quantity: 2, price: 80 },
        { name: "Iced Americano", quantity: 1, price: 45 },
      ],
      total: 205,
      time: "07:45 PM",
      payment: "Counter",
      status: "Preparing",
    },
    {
      id: "#8802",
      table: "12",
      items: [{ name: "Truffle Pasta", quantity: 1, price: 120 }],
      total: 120,
      time: "08:10 PM",
      payment: "Online",
      status: "New",
    },
  ]);

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-slate-100 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            KITCHEN{" "}
            <span className="text-orange-500 underline decoration-2 underline-offset-8">
              COMMAND
            </span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Managing active orders in real-time
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm font-bold uppercase tracking-wider">
              System Live
            </span>
          </div>
          <div className="pr-4 text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">
              Orders Pending
            </p>
            <p className="text-xl font-black text-white">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_40px_-15px_rgba(249,115,22,0.3)]"
          >
            {/* Card Header */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
                  Order {order.id}
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  TABLE {order.table}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.payment === "Online" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}
                >
                  {order.payment}
                </span>
                <div className="flex items-center gap-1 text-slate-500 font-medium text-sm">
                  <Clock size={14} />
                  {order.time}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6">
              <div className="space-y-4 mb-8">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group/item"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 font-bold text-sm">
                        {item.quantity}
                      </span>
                      <p className="text-slate-200 font-semibold group-hover/item:text-orange-400 transition-colors">
                        {item.name}
                      </p>
                    </div>
                    <div className="h-px flex-grow mx-4 border-t border-dotted border-slate-700"></div>
                    <span className="text-slate-400 font-mono text-sm">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="flex justify-between items-end border-t border-slate-700/50 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Grand Total
                  </p>
                  <span className="text-3xl font-black text-white">
                    ₹{order.total}
                  </span>
                </div>

                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg shadow-orange-500/20">
                  COMPLETE <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
          </div>
        ))}

        {/* Empty State / Add New Placeholder */}
        <div className="border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-600 hover:text-slate-500 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-4xl">+</span>
          </div>
          <p className="font-bold uppercase tracking-widest text-sm">
            Waiting for orders...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
