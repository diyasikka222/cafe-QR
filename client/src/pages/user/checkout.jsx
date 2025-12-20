import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cartContext";
import { useTable } from "../../contexts/tableContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { tableNumber } = useTable();

  const handlePlaceOrder = () => {
    if (!tableNumber) return alert("Missing Table ID!");

    const orderData = {
      table: tableNumber,
      items: cart,
      total: getTotal(),
      time: new Date().toLocaleTimeString(),
    };

    // LOGGING INSTEAD OF SENDING TO SERVER
    console.log("DEMO MODE: Order Data:", orderData);
    alert("Order Simulated! Check your browser console (F12).");

    clearCart();
    navigate("/confirmation");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-gray-100 p-6 rounded-3xl mb-6">
        <p>
          <strong>Table:</strong> {tableNumber || "None"}
        </p>
        <p>
          <strong>Bill:</strong> ₹{getTotal()}
        </p>
      </div>
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold"
      >
        Place Demo Order
      </button>
    </div>
  );
};

export default Checkout;
