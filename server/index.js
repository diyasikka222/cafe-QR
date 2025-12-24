const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path"); // 1. IMPORT PATH
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

/* ===========================
   1. DATABASE CONNECTION
=========================== */
connectDB();

/* ===========================
   2. MIDDLEWARES
=========================== */
app.use(
  cors({
    origin: ["http://localhost:5173"],
    // 2. ADD 'PUT' AND 'DELETE' HERE
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// 3. ROBUST STATIC FILE SERVING
// This ensures images load correctly regardless of where you start the server
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===========================
   3. SOCKET.IO SETUP
=========================== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// Make io accessible inside routes/controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`📡 Kitchen connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Kitchen disconnected: ${socket.id}`);
  });
});

/* ===========================
   4. ROUTES
=========================== */
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

/* ===========================
   5. SERVER START
=========================== */
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
