import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  X,
  ClipboardList,
  Home,
  Utensils,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to close sidebar when clicking a link
  const closeSidebar = () => setIsSidebarOpen(false);

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
        /* MAIN NAVBAR CONTAINER */
        .main-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(8, 8, 8, 0.8);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 15px 5%;

          /* LAYOUT FOR CENTERED LOGO */
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Aligns hamburger to left */
          position: relative; /* Needed for absolute centering */
          width: 100%;
          height: 70px;
          box-sizing: border-box;
        }

        /* CENTERED LOGO */
        .nav-logo-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);

          font-size: 20px;
          font-weight: 900;
          letter-spacing: 3px;
          color: white;
          text-decoration: none;
          white-space: nowrap;
        }

        /* HAMBURGER BUTTON */
        .nav-icon-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          z-index: 1002; /* Ensure clickable above text */
        }

        .nav-icon-btn:hover {
          background: #f97316;
          border-color: #f97316;
        }

        /* --- SIDEBAR SLIDER --- */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 2000;
          opacity: ${isSidebarOpen ? "1" : "0"};
          visibility: ${isSidebarOpen ? "visible" : "hidden"};
          transition: 0.3s;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100%;
          background: #111;
          z-index: 2001;
          padding: 40px 30px;
          transform: translateX(${isSidebarOpen ? "0" : "-100%"});
          transition: 0.5s cubic-bezier(0.77, 0, 0.175, 1);
          box-shadow: 10px 0 40px rgba(0,0,0,0.5);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          text-decoration: none;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-weight: 700;
          font-size: 16px;
        }

        .sidebar-item:hover { color: #f97316; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="main-navbar">
        {/* Left: Hamburger Only */}
        <button className="nav-icon-btn" onClick={() => setIsSidebarOpen(true)}>
          <MenuIcon size={20} />
        </button>

        {/* Center: Absolute Logo */}
        <Link to="/menu" className="nav-logo-center">
          MANESAR <span style={{ color: "#f97316" }}>CAFE</span>
        </Link>
      </nav>

      {/* --- MOBILE SLIDER (SIDEBAR) --- */}
      <div className="sidebar-overlay" onClick={closeSidebar}></div>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div
            style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "2px" }}
          >
            MANESAR CAFE
          </div>
          <X
            color="white"
            onClick={closeSidebar}
            style={{ cursor: "pointer" }}
          />
        </div>

        <nav>
          <Link to="/menu" className="sidebar-item" onClick={closeSidebar}>
            <div style={{ display: "flex", gap: "15px" }}>
              <Home size={20} /> Home
            </div>
            <ChevronRight size={16} opacity={0.3} />
          </Link>

          <Link to="/menu" className="sidebar-item" onClick={closeSidebar}>
            <div style={{ display: "flex", gap: "15px" }}>
              <Utensils size={20} /> Menu
            </div>
            <ChevronRight size={16} opacity={0.3} />
          </Link>

          <Link to="/orders" className="sidebar-item" onClick={closeSidebar}>
            <div style={{ display: "flex", gap: "15px" }}>
              <ClipboardList size={20} /> My Orders
            </div>
            <ChevronRight size={16} opacity={0.3} />
          </Link>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "60px" }}>
          <p
            style={{
              color: "#444",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Support
          </p>
          <p style={{ color: "#888", fontSize: "13px", marginTop: "10px" }}>
            Help Center
          </p>
          <p style={{ color: "#888", fontSize: "13px", marginTop: "5px" }}>
            Terms of Service
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
