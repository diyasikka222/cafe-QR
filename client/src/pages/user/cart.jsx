import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useTable } from '../../contexts/TableContext';
import { Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
    const { cart, getTotal, clearCart } = useCart();
    const { tableNumber } = useTable();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <h2 className="text-2xl font-bold mb-4">Your tray is empty</h2>
                <Link to="/menu" className="text-orange-500 font-bold underline">Back to Menu</Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/menu')}><ArrowLeft /></button>
                <h1 className="text-2xl font-bold">Review Order</h1>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-4 mb-4">
                <p className="text-sm text-gray-500 mb-4">Table: {tableNumber || 'N/A'}</p>
                {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl mb-6">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-orange-600">₹{getTotal()}</span>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold"
            >
                Proceed to Checkout
            </button>

            <button
                onClick={clearCart}
                className="w-full text-red-500 mt-4 text-sm font-medium"
            >
                Clear Tray
            </button>
        </div>
    );
};

export default Cart;