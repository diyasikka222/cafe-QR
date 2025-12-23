import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../contexts/cartContext";
import { Plus, Minus, ShoppingCart, X, ArrowRight } from "lucide-react";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableFromUrl = searchParams.get("table");
  const currentTable = tableFromUrl || "05";

  const { addToCart, removeFromCart, getItemQuantity, getTotal, cart } =
    useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        NAVIGATION LOGIC
  =============================== */
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsModalOpen(false);
    navigate(`/checkout?table=${currentTable}`);
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

        /* --- CRITICAL FIX FOR WHITE SPACE --- */
        html, body, #root {
          background-color: var(--bg) !important;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden; /* Prevent horizontal scroll white space */
        }

        .lumiere-app {
          background-color: var(--bg);
          color: var(--text-main);
          min-height: 100vh;
          width: 100%;
          padding-bottom: 120px; /* Space for floating cart */
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

        .card:hover {
          border-color: var(--brand);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
          background: var(--surface-highlight);
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
          transition: transform 0.5s ease;
        }

        .card:hover .img-container img {
          transform: scale(1.05);
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

        .proceed-btn {
          background: var(--brand);
          color: #000;
          border: none;
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 1.1rem;
          margin-top: 20px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .proceed-btn:hover {
          filter: brightness(1.1);
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
                <img
                  src={`http://localhost:5001/uploads/${item.image}`}
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

      {/* CART BAR (Only visible if modal is closed) */}
      {cart.length > 0 && !isModalOpen && (
        <div className="cart-bar">
          <div>
            <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>
              ITEM TOTAL
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800 }}>
              ₹{getTotal()}
            </div>
          </div>
          <button className="checkout-btn" onClick={() => setIsModalOpen(true)}>
            VIEW CART <ShoppingCart size={18} fill="black" />
          </button>
        </div>
      )}

      {/* VIEW CART MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Table {currentTable} Order</div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

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
                    >
                      <Minus size={14} />
                    </button>
                    <span className="q-val" style={{ fontSize: "0.9rem" }}>
                      {item.quantity}
                    </span>
                    <button className="q-btn" onClick={() => addToCart(item)}>
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

              <button className="proceed-btn" onClick={handleProceedToCheckout}>
                PROCEED TO CHECKOUT <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
