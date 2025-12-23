import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../contexts/cartContext";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"; // Icons for UI
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. Get Table Number from URL
    const tableNumber = searchParams.get("table") || "05";

    const { cart, getTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentAndOrder = async () => {
        if (cart.length === 0) return navigate(`/menu?table=${tableNumber}`);

        setIsProcessing(true);

        try {
            // 2. SIMULATE PAYMENT DELAY (Optional, feels more real)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. SEND ORDER TO KITCHEN DASHBOARD (Backend)
            await axios.post("http://localhost:5001/api/orders", {
                tableNumber: tableNumber,
                items: cart.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: getTotal(),
                paymentStatus: "Paid" // You can add this field to your backend schema if you want
            });

            // 4. CLEAR CART AND GO TO CONFIRMATION
            clearCart();
            navigate(`/confirmation?table=${tableNumber}`); // Pass table number to confirmation too

        } catch (err) {
            console.error("Payment or Order failed", err);
            alert("Transaction failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans p-6 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-md flex items-center mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="flex-1 text-center text-xl font-black tracking-wide">CHECKOUT</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="w-full max-w-md">

                {/* Bill Summary */}
                <div className="bg-[#1a1d23] p-6 rounded-3xl border border-slate-800 mb-6">
                    <div className="flex justify-between mb-4 border-b border-slate-800 pb-4">
                        <span className="text-slate-400 font-medium">Table</span>
                        <span className="font-bold text-orange-500 text-lg">{tableNumber}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-300">{item.quantity} x {item.name}</span>
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-800">
                        <span className="text-slate-400 font-bold">Total to Pay</span>
                        <span className="font-black text-2xl text-white">₹{getTotal()}</span>
                    </div>
                </div>

                {/* Payment Methods (Visual Only) */}
                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4 ml-2">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex flex-col items-center justify-center bg-orange-500 text-white p-4 rounded-2xl border-2 border-orange-500 shadow-lg shadow-orange-500/20">
                        <CreditCard className="mb-2" />
                        <span className="font-bold text-sm">UPI / Card</span>
                    </button>
                    <button className="flex flex-col items-center justify-center bg-[#1a1d23] text-slate-400 p-4 rounded-2xl border border-slate-800">
                        <Wallet className="mb-2" />
                        <span className="font-bold text-sm">Cash</span>
                    </button>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePaymentAndOrder}
                    disabled={isProcessing}
                    className={`w-full py-5 rounded-2xl font-black text-lg tracking-wide shadow-xl transition-all ${
                        isProcessing
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-white text-black hover:bg-slate-200"
                    }`}
                >
                    {isProcessing ? "PROCESSING..." : `PAY ₹${getTotal()}`}
                </button>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Secure encrypted transaction
                </p>

            </div>
        </div>
    );
};

export default Checkout;