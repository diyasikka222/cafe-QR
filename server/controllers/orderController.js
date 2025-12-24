const Order = require("../models/Order");

// 1. GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    const io = req.app.get("io");
    if (io) io.emit("new-order", savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

// 3. UPDATE ORDER (This is the one causing the error if missing)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    let updateData = {};

    if (status) updateData.status = status;

    // Auto-update logic if just bumping status
    if (!status && !paymentStatus) {
      const currentOrder = await Order.findById(id);
      if (currentOrder.status === "New") updateData.status = "Preparing";
      else if (currentOrder.status === "Preparing")
        updateData.status = "Served";
    }

    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    if (io) io.emit("order-updated", updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- CRITICAL PART: MAKE SURE THIS IS AT THE BOTTOM ---
module.exports = {
  getOrders,
  createOrder,
  updateOrder, // <--- Ensure this comma and name exist!
};
