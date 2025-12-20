import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useTable } from '../../contexts/TableContext';

const Menu = () => {
    const { addToCart } = useCart();
    const { tableNumber } = useTable();

    const menuItems = [
        { id: 1, name: "Classic Margherita", price: 80, image: "🍕" },
        { id: 2, name: "Aloo Tikki Burger", price: 50, image: "🍔" },
        { id: 3, name: "Veg Steamed Momos", price: 60, image: "🥟" }
    ];

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-black">CAFE MENU</h1>
                <div className={`mt-2 py-1 px-4 rounded-full inline-block font-bold ${tableNumber ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {tableNumber ? `Ordering for Table ${tableNumber}` : '⚠️ Scan QR Code to Order'}
                </div>
            </div>

            <div className="space-y-4">
                {menuItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{item.image}</span>
                            <div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-orange-600 font-bold">₹{item.price}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => addToCart(item)}
                            disabled={!tableNumber}
                            className="bg-orange-500 text-white w-10 h-10 rounded-xl font-bold disabled:bg-gray-300"
                        > + </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;