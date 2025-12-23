import React, { useState } from "react";
import { useSearchParams } from "react-router-dom"; // <--- CHANGED THIS
import { useCart } from "../../contexts/cartContext";
import { Plus, Minus, X, ShoppingCart, CheckCircle, Flame } from "lucide-react";
import axios from "axios";

const Menu = () => {
    // 1. GET TABLE NUMBER FROM QUERY STRING (?table=0)
    const [searchParams] = useSearchParams();
    const tableFromUrl = searchParams.get("table");

    // Default to "05" (or any default) if url is just /menu
    const currentTable = tableFromUrl || "05";

    const {
        addToCart,
        removeFromCart,
        getItemQuantity,
        getTotal,
        cart,
        clearCart,
    } = useCart();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const menuItems = [
        {
            id: 1,
            name: "Classic Margherita",
            price: 80,
            image: "🍕",
            desc: "San Marzano tomatoes, fresh mozzarella, and aromatic basil.",
        },
        {
            id: 2,
            name: "Aloo Tikki Burger",
            price: 50,
            image: "🍔",
            desc: "Crispy spiced potato patty with house-made mint glaze.",
        },
        {
            id: 3,
            name: "Veg Steamed Momos",
            price: 60,
            image: "🥟",
            desc: "Hand-rolled dumplings with spicy roasted tomato dip.",
        },
        {
            id: 4,
            name: "Truffle Fries",
            price: 110,
            image: "🍟",
            desc: "Golden fries drizzled with truffle oil and parmesan.",
        },
        {
            id: 5,
            name: "Iced Caramel Latte",
            price: 95,
            image: "☕",
            desc: "Slow-dripped arabica coffee with silky caramel.",
        },
        {
            id: 6,
            name: "Paneer Tikka Wrap",
            price: 120,
            image: "🌯",
            desc: "Grilled cottage cheese with peppers and spicy sauce.",
        },
        {
            id: 7,
            name: "Spicy Chicken Wings",
            price: 180,
            image: "🍗",
            desc: "Tossed in fiery peri-peri sauce.",
        },
        {
            id: 8,
            name: "Hazelnut Brownie",
            price: 150,
            image: "🍫",
            desc: "Served warm with a scoop of vanilla bean ice cream.",
        },
    ];

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setIsSending(true);

        try {
            await axios.post("http://localhost:5001/api/orders", {
                // 2. USE THE DYNAMIC TABLE VARIABLE HERE
                tableNumber: currentTable,
                items: cart.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: getTotal(),
            });

            setIsModalOpen(false);
            setIsSuccessModalOpen(true);
            clearCart();
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to send order");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="lumiere-app">
            <style>{`
        /* --- GLOBAL RESET --- */
        :root {
          --brand: #f97316;
          --bg: #0f1115;
          --surface: #1a1d23;
          --border: #1e293b;
          --text-main: #f1f5f9;
          --text-muted: #94a3b8;
        }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          background-color: var(--bg) !important;
          overflow-x: hidden;
        }

        .lumiere-app {
          background: var(--bg);
          color: var(--text-main);
          min-height: 100vh;
          width: 100%;
          font-family: 'Inter', system-ui, sans-serif;
          padding-bottom: 120px;
          position: absolute;
          top: 0;
          left: 0;
        }

        /* --- HEADER --- */
        .header {
          padding: 20px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: rgba(15, 17, 21, 0.9);
          backdrop-filter: blur(12px);
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: 1px; color: white; }

        /* --- RESPONSIVE GRID --- */
        .item-grid {
          display: grid;
          padding: 30px 5%;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          max-width: 1600px;
          margin: 0 auto;
        }

        /* --- CARD DESIGN --- */
        .card {
          background: var(--surface);
          border-radius: 20px;
          border: 1px solid var(--border);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
        }
        .card:hover {
          border-color: var(--brand);
          transform: translateY(-4px);
        }

        .img-container {
          height: 140px;
          width: 100%;
          background: radial-gradient(circle at center, #23272f 0%, #14161b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          position: relative;
        }

        .bestseller-tag {
          position: absolute;
          top: 10px; left: 10px;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-size: 10px; font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex; align-items: center; gap: 4px;
          backdrop-filter: blur(4px);
        }

        .card-content {
          padding: 18px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 40px;
        }

        /* --- ACTION AREA --- */
        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .price { font-size: 18px; font-weight: 800; color: white; }

        .add-btn {
          padding: 8px 24px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--brand);
          font-weight: 800;
          font-size: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.2s;
        }
        .add-btn:hover { background: var(--brand); color: white; border-color: var(--brand); }

        .qty-control {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 2px;
        }
        .q-btn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          color: white; border: none;
          cursor: pointer; border-radius: 8px;
        }
        .q-btn:hover { background: rgba(255,255,255,0.05); }
        .q-val {
          width: 30px; text-align: center;
          font-weight: 800; font-size: 14px;
          color: var(--brand);
        }

        /* --- FIXED CART BAR --- */
        .cart-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 450px;
          box-sizing: border-box;
          background: white;
          color: black;
          padding: 12px 20px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          z-index: 1000;
          margin-bottom: env(safe-area-inset-bottom);
        }

        /* --- MODAL --- */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex; justify-content: center; align-items: center;
          padding: 20px;
        }
        .modal-content {
          background: #13161b;
          width: 100%; max-width: 480px;
          border-radius: 24px;
          border: 1px solid var(--border);
          padding: 24px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .close-btn {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: white;
        }
      `}</style>

            {/* HEADER */}
            <header className="header">
                <div className="logo">
                    MANESAR <span style={{ color: "var(--brand)" }}>CAFE</span>
                </div>
                <div
                    style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        color: "var(--brand)",
                        background: "rgba(249,115,22,0.1)",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid rgba(249,115,22,0.2)",
                    }}
                >
                    {/* DISPLAY THE URL TABLE NUMBER */}
                    TABLE {currentTable}
                </div>
            </header>

            {/* MENU GRID */}
            <main className="item-grid">
                {menuItems.map((item) => {
                    const qty = getItemQuantity(item.id);
                    return (
                        <div key={item.id} className="card">
                            <div className="img-container">
                                <div className="bestseller-tag">
                                    <Flame size={10} fill="currentColor" /> BESTSELLER
                                </div>
                                {item.image}
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{item.name}</h3>
                                <p className="card-desc">{item.desc}</p>

                                <div className="price-row">
                                    <span className="price">₹{item.price}</span>
                                    {qty === 0 ? (
                                        <button className="add-btn" onClick={() => addToCart(item)}>
                                            ADD
                                        </button>
                                    ) : (
                                        <div className="qty-control">
                                            <button
                                                className="q-btn"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="q-val">{qty}</span>
                                            <button className="q-btn" onClick={() => addToCart(item)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>

            {/* FLOATING CART - HIDDEN WHEN MODAL IS OPEN */}
            {cart.length > 0 && !isModalOpen && !isSuccessModalOpen && (
                <div className="cart-bar">
                    <div>
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: 800,
                                color: "#666",
                                letterSpacing: "0.5px",
                            }}
                        >
                            TOTAL
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: 900 }}>
                            ₹{getTotal()}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: "black",
                            color: "white",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        VIEW CART <ShoppingCart size={14} />
                    </button>
                </div>
            )}

            {/* CART MODAL */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="close-btn" onClick={() => setIsModalOpen(false)}>
                            <X size={16} />
                        </div>
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: 900,
                                marginBottom: "20px",
                            }}
                        >
                            Your Order
                        </h2>

                        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "16px",
                                        paddingBottom: "16px",
                                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                background: "#222",
                                                borderRadius: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "20px",
                                            }}
                                        >
                                            {item.image}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: "14px" }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#999" }}>
                                                ₹{item.price}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="qty-control" style={{ height: "32px" }}>
                                        <button
                                            className="q-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span
                                            className="q-val"
                                            style={{ fontSize: "12px", width: "24px" }}
                                        >
                      {item.quantity}
                    </span>
                                        <button className="q-btn" onClick={() => addToCart(item)}>
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isSending}
                            style={{
                                width: "100%",
                                padding: "16px",
                                marginTop: "20px",
                                background: "var(--brand)",
                                color: "white",
                                border: "none",
                                borderRadius: "14px",
                                fontWeight: 900,
                                fontSize: "14px",
                                cursor: isSending ? "not-allowed" : "pointer",
                                opacity: isSending ? 0.7 : 1,
                            }}
                        >
                            {isSending ? "SENDING ORDER..." : `PLACE ORDER • ₹${getTotal()}`}
                        </button>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {isSuccessModalOpen && (
                <div className="modal-overlay">
                    <div
                        className="modal-content"
                        style={{ textAlign: "center", padding: "40px 20px" }}
                    >
                        <CheckCircle
                            size={64}
                            color="#22c55e"
                            style={{ margin: "0 auto 20px auto" }}
                        />
                        <h2
                            style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px" }}
                        >
                            Order Sent!
                        </h2>
                        <p
                            style={{
                                color: "#999",
                                fontSize: "14px",
                                marginBottom: "30px",
                            }}
                        >
                            The kitchen has received your order for Table {currentTable}.
                        </p>
                        <button
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                clearCart();
                            }}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: "#fff",
                                color: "#000",
                                border: "none",
                                borderRadius: "14px",
                                fontWeight: 900,
                            }}
                        >
                            BACK TO MENU
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;