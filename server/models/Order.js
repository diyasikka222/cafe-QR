const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Preparing", "Served"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid"],
    },
  },
  { timestamps: true }, // <--- CRITICAL: This automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
