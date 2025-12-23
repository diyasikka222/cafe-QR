const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tableNumber: String,
    items: Array,
    total: Number,
    status: {
      type: String,
      enum: ["New", "Preparing", "Served"],
      default: "New",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
