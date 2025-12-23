import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, X, MessageCircle, Star } from "lucide-react";

const Navbar = () => {
    const location = useLocation();
    const [isContactOpen, setIsContactOpen] = useState(false);

    // --- ADMIN VIEW (Unchanged) ---
    if (location.pathname.startsWith("/admin")) {
        return (
            <nav className="admin-nav">
                <style>{`
          .admin-nav {
            padding: 15px 5%;
            background: #000;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f97316;
            font-family: 'Inter', sans-serif;
          }
        `}</style>
                <h1 className="font-black text-xl tracking-widest">
                    MANESAR <span className="text-orange-500">ADMIN</span>
                </h1>
                <Link
                    to="/"
                    className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
                >
                    Exit Terminal
                </Link>
            </nav>
        );
    }

    // --- CUSTOMER VIEW ---
    return (
        <>
            <style>{`
        /* NAVBAR CONTAINER */
        .navbar-black {
          position: sticky;
          top: 0;
          z-index: 1000;
          /* Deep Blackish Background */
          background: rgba(5, 5, 5, 0.95);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 15px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        /* --- ORIGINAL BRAND LOGO --- */
        .brand-logo {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-highlight {
          color: #f97316; /* Orange */
        }

        /* --- BUTTON GROUP --- */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* GENERAL BUTTON STYLE */
        .nav-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ccc;
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: #f97316;
          color: white;
          border-color: #f97316;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        /* FEEDBACK SPECIFIC STYLE (Gold Accent) */
        .feedback-btn {
          border-color: rgba(255, 215, 0, 0.2);
        }
        
        .feedback-btn:hover {
          background: #eab308; /* Gold/Yellow */
          border-color: #eab308;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
          color: black;
        }

        /* --- MODAL STYLES (Unchanged) --- */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .contact-modal {
          background: #14161b;
          border: 1px solid #2d3340;
          padding: 30px;
          border-radius: 24px;
          width: 100%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          animation: scaleUp 0.3s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .modal-close {
          position: absolute;
          top: 20px; right: 20px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #fff;
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
          color: #ccc;
        }
        .info-icon {
          color: #f97316;
          margin-top: 2px;
        }
        .info-label {
          display: block;
          font-size: 12px;
          color: #666;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .info-text {
          font-size: 15px;
          font-weight: 500;
          color: #f1f5f9;
        }
        
        /* Mobile adjustment */
        @media (max-width: 600px) {
           .nav-btn span { display: none; } /* Hide button text on small screens */
           .nav-btn { padding: 10px; }
        }
      `}</style>

            {/* --- NAVBAR --- */}
            <nav className="navbar-black">
                {/* ORIGINAL LOGO STYLE */}
                <Link to="/menu" className="brand-logo">
                    MANESAR<span className="brand-highlight">CAFE</span>
                </Link>

                {/* RIGHT SIDE ACTIONS */}
                <div className="nav-actions">

                    {/* CONTACT BUTTON */}
                    <button className="nav-btn" onClick={() => setIsContactOpen(true)}>
                        <MessageCircle size={18} />
                        <span>Contact Us</span>
                    </button>

                    {/* NEW FEEDBACK BUTTON (Review Link Updated) */}
                    <a
                        href="https://www.google.com/search?sca_esv=283b61cf11016ab2&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E7wGo_nXQ57SLaksU_w63hnGwTYjpab6BiumO-B7L4-UXQPLcpSoELbYbA3aYLoBmg6VU6P-3AZQ2tljMFHXjHNyRV6IAoicpyufXRmpPXKzJ_wWVg%3D%3D&q=Manesar+Cafe+%26+Restaurant+Reviews&sa=X&ved=2ahUKEwjap5j29tORAxUeTGwGHR2SKJYQ0bkNegQIHhAD&biw=2137&bih=1114&dpr=1.6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-btn feedback-btn"
                    >
                        <Star size={18} />
                        <span>Rate Us</span>
                    </a>

                </div>
            </nav>

            {/* --- CONTACT MODAL --- */}
            {isContactOpen && (
                <div className="modal-overlay" onClick={() => setIsContactOpen(false)}>
                    <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setIsContactOpen(false)}
                        >
                            <X size={18} />
                        </button>

                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: 900,
                                marginBottom: "8px",
                                color: "white",
                            }}
                        >
                            Get in Touch
                        </h2>
                        <p
                            style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}
                        >
                            We are here to help you with your order.
                        </p>

                        <div className="info-row">
                            <Phone size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Phone</span>
                                <span className="info-text">+91 98765 43210</span>
                            </div>
                        </div>

                        <div className="info-row">
                            <Mail size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Email</span>
                                <span className="info-text">support@manesarcafe.com</span>
                            </div>
                        </div>

                        <div className="info-row">
                            <MapPin size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Location</span>
                                <span className="info-text">
                  Sector 1, Manesar,
                  <br />
                  Gurugram, Haryana 122051
                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsContactOpen(false)}
                            style={{
                                width: "100%",
                                padding: "14px",
                                marginTop: "10px",
                                background: "#f97316",
                                border: "none",
                                borderRadius: "12px",
                                color: "white",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;