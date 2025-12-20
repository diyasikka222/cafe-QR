const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// 1. Connect to Database
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Socket.io setup
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Pass 'io' to express so controllers can use it
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`📡 New Socket: ${socket.id}`);
  socket.on("disconnect", () => console.log("🔌 Disconnected"));
});

// 4. Routes
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
