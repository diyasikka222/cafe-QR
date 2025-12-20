// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite's default port
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // When a Customer sends an order
    socket.on('place_order', (orderData) => {
        console.log('Order received from table:', orderData.table);
        // Send it to the Admin immediately
        io.emit('new_order_alert', orderData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5001, () => {
    console.log('SERVER RUNNING ON PORT 5001');
});