const Order = require("../models/Order");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { tableNumber, items, total } = req.body;

    const order = await Order.create({
      tableNumber,
      items,
      total,
    });

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    io.emit("new-order", order);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};

// GET ACTIVE ORDERS
const getOrders = async (req, res) => {
  const orders = await Order.find({ status: { $ne: "Served" } }).sort({
    createdAt: -1,
  });

  res.json(orders);
};

// UPDATE STATUS
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = order.status === "New" ? "Preparing" : "Served";

  await order.save();

  // 🔥 SOCKET EMIT
  const io = req.app.get("io");
  io.emit("order-updated", order);

  res.json(order);
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
