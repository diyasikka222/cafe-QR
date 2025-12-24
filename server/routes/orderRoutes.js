const express = require("express");
const router = express.Router();

// Import the functions.
// If updateOrder was missing in the controller export, this variable would be 'undefined', causing the crash.
const {
  getOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);

// The error happened here because updateOrder was undefined
router.patch("/:id", updateOrder);

module.exports = router;
