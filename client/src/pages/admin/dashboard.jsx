import React, { useState } from 'react';

const AdminDashboard = () => {
    // SEEDED WITH DEMO DATA FOR FRONTEND TESTING
    const [orders, setOrders] = useState([
        {
            table: "05",
            items: [{ name: "Margherita Pizza", quantity: 2, price: 80 }],
            total: 160,
            time: "07:45 PM",
            payment: "counter"
        }
    ]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black">KITCHEN DISPLAY (Demo)</h1>
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">Server Offline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-lg border-t-8 border-orange-500">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-black text-gray-800">TABLE {order.table}</h2>
                            <span className="text-gray-400">{order.time}</span>
                        </div>
                        <div className="space-y-1 mb-6">
                            {order.items.map((item, i) => (
                                <p key={i} className="font-medium">{item.quantity}x {item.name}</p>
                            ))}
                        </div>
                        <div className="flex justify-between font-black text-xl pt-4 border-t">
                            <span>Total</span>
                            <span className="text-orange-600">₹{order.total}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;