const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getMenuItems,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  toggleAvailability,
} = require("../controllers/menuController");

// Existing Routes
router.get("/", getMenuItems);
router.post("/", upload.single("image"), addMenuItem);
router.patch("/:id/toggle", toggleAvailability);

// NEW ROUTES
router.delete("/:id", deleteMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);

module.exports = router;
