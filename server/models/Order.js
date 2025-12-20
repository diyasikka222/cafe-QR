const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    table: { type: String, required: true },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "New" },
    time: String,
    payment: { type: String, default: "counter" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
