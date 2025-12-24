import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../contexts/cartContext";
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  ChefHat,
  CheckCircle,
  Loader2,
} from "lucide-react";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const tableFromUrl = searchParams.get("table");
  const currentTable = tableFromUrl || "05";

  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotal,
    cart,
    clearCart,
  } = useCart();

  // STATE
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ORDER PROCESSING STATE
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  /* ===============================
        FETCH MENU FROM DB
  =============================== */
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/menu")
      .then((res) => {
        setMenuItems(res.data.filter((i) => i.available));
      })
      .catch(console.error);
  }, []);

  /* ===============================
        SEND ORDER LOGIC
  =============================== */
  const handleSendOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      // 1. Simulate Network Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Send to Backend
      await axios.post("http://localhost:5001/api/orders", {
        tableNumber: currentTable,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotal(),
        paymentStatus: "Paid", // Or 'Pending'
      });

      // 3. Success Feedback
      setOrderSent(true);
      clearCart();

      // 4. Close Modal after 2.5 seconds
      setTimeout(() => {
        setIsCartOpen(false);
        setOrderSent(false);
      }, 2500);
    } catch (err) {
      console.error("Order failed", err);
      alert("Failed to send order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ===============================
        CATEGORY FILTER
  =============================== */
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="lumiere-app">
      <style>{`
        :root {
          --brand: #f97316;
          --bg: #0f1115;
          --surface: #1a1d23;
          --surface-highlight: #23272f;
          --border: #2d3340;
          --text-main: #f1f5f9;
          --text-muted: #94a3b8;
        }

        html, body, #root {
          background-color: var(--bg) !important;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .lumiere-app {
          background-color: var(--bg);
          color: var(--text-main);
          min-height: 100vh;
          width: 100%;
          padding-bottom: 120px;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* --- GRID & CARD STYLES --- */
        .item-grid {
          display: grid;
          padding: 20px 5%;
          gap: 32px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .card {
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          padding: 12px;
          position: relative;
        }

        .img-container {
          height: 240px;
          width: 100%;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          background: #000;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          padding: 16px 8px 8px 8px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .card-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 24px;
          font-weight: 500;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .add-btn {
          padding: 10px 28px;
          border: 1px solid var(--border);
          color: var(--brand);
          background: rgba(249, 115, 22, 0.1);
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .add-btn:hover {
          background: var(--brand);
          color: #000;
          border-color: var(--brand);
        }

        .qty-control {
          display: flex;
          align-items: center;
          background: var(--surface-highlight);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 4px;
        }

        .q-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .q-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .q-val {
          width: 36px;
          text-align: center;
          color: var(--brand);
          font-weight: 800;
          font-size: 1.1rem;
        }

        /* --- CATEGORY FILTER --- */
        .category-scroll {
          padding: 20px 5% 0 5%;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          width: 100%;
          box-sizing: border-box;
        }

        .cat-btn {
          padding: 8px 20px;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
        }

        .cat-btn.active {
          background: var(--text-main);
          color: #000;
          border-color: var(--text-main);
          font-weight: 800;
        }

        /* --- CART BAR --- */
        .cart-bar {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 16px 24px;
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: calc(100% - 48px);
          max-width: 500px;
          z-index: 900;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .checkout-btn {
          background: var(--brand);
          color: #000;
          border: none;
          padding: 12px 28px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .checkout-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
        }

        /* --- MODAL STYLES --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        @media (min-width: 768px) {
          .modal-overlay {
             align-items: center;
          }
        }

        .modal-content {
          background: #14161b;
          width: 100%;
          max-width: 500px;
          border-radius: 24px 24px 0 0;
          border: 1px solid var(--border);
          padding: 24px;
          animation: slideUp 0.3s ease;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
           .modal-content {
             border-radius: 24px;
           }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .item-details h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
        }
        .item-details p {
           margin: 4px 0 0 0;
           font-size: 0.85rem;
           color: var(--text-muted);
        }

        /* SEND TO KITCHEN BUTTON */
        .send-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          width: 100%;
          padding: 18px;
          border-radius: 20px;
          font-weight: 900;
          font-size: 1.1rem;
          margin-top: 20px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px -5px rgba(249, 115, 22, 0.4);
          transition: all 0.2s ease;
        }

        .send-btn:disabled {
            background: #334155;
            color: #94a3b8;
            cursor: not-allowed;
            box-shadow: none;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.02);
          filter: brightness(1.1);
        }

        /* SUCCESS STATE */
        .success-view {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
            text-align: center;
        }
        .success-view h2 {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--brand);
        }
        .success-view p {
            color: var(--text-muted);
        }
      `}</style>

      {/* CATEGORY FILTER */}
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <main className="item-grid">
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item._id);
          return (
            <div key={item._id} className="card">
              <div className="img-container">
                {/* FIX APPLIED HERE:
                   Removed the extra '/uploads/' from the path
                */}
                <img
                  src={`http://localhost:5001${item.image}`}
                  alt={item.name}
                />
              </div>

              <div className="card-content">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-desc">{item.category}</p>

                <div className="price-row">
                  <span className="price">₹{item.price}</span>

                  {qty === 0 ? (
                    <button
                      className="add-btn"
                      onClick={() => addToCart({ ...item, id: item._id })}
                    >
                      ADD +
                    </button>
                  ) : (
                    <div className="qty-control">
                      <button
                        className="q-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="q-val">{qty}</span>
                      <button
                        className="q-btn"
                        onClick={() => addToCart({ ...item, id: item._id })}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOATING CART BAR */}
      {cart.length > 0 && !isCartOpen && (
        <div className="cart-bar">
          <div>
            <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>
              ITEM TOTAL
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800 }}>
              ₹{getTotal()}
            </div>
          </div>
          <button className="checkout-btn" onClick={() => setIsCartOpen(true)}>
            VIEW CART <ShoppingCart size={18} fill="black" />
          </button>
        </div>
      )}

      {/* UNIFIED CART + ORDER MODAL */}
      {isCartOpen && (
        <div
          className="modal-overlay"
          onClick={() => !isProcessing && setIsCartOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-title">
                {orderSent ? "Order Sent!" : `Table ${currentTable}`}
              </div>
              {!isProcessing && !orderSent && (
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Content Switch: Order Success vs List Items */}
            {orderSent ? (
              <div className="success-view">
                <CheckCircle
                  size={80}
                  className="text-green-500 mb-6 animate-bounce"
                />
                <h2>Delicious!</h2>
                <p>Your order has been sent to the kitchen.</p>
                <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                  Closing...
                </p>
              </div>
            ) : (
              <>
                <div style={{ flexGrow: 1, overflowY: "auto" }}>
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="qty-control">
                        <button
                          className="q-btn"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isProcessing}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="q-val" style={{ fontSize: "0.9rem" }}>
                          {item.quantity}
                        </span>
                        <button
                          className="q-btn"
                          onClick={() => addToCart(item)}
                          disabled={isProcessing}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                    <span>₹{getTotal()}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      color: "var(--brand)",
                    }}
                  >
                    <span>Grand Total</span>
                    <span>₹{getTotal()}</span>
                  </div>

                  <button
                    className="send-btn"
                    onClick={handleSendOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        SEND TO KITCHEN <ChefHat size={24} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
