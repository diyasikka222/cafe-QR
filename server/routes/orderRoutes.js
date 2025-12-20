const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateStatus,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:id", updateStatus);

module.exports = router;
