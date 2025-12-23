const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
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
    origin: ["http://localhost:5173"], // customer + admin frontend
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* ===========================
   3. SOCKET.IO SETUP
=========================== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
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

/*menu */

const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menu", menuRoutes);

/* ===========================
   5. SERVER START
=========================== */
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
