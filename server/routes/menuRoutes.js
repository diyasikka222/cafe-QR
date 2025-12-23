const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const menuController = require("../controllers/menuController");
console.log("MENU CONTROLLER EXPORT:", menuController);

router.get("/", menuController.getMenuItems);
router.post("/", upload.single("image"), menuController.addMenuItem);
router.patch("/:id/toggle", menuController.toggleAvailability);

module.exports = router;
