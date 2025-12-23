const MenuItem = require("../models/MenuItem");

console.log("🔥 REAL MENU CONTROLLER FILE LOADED");
console.log("MenuItem model:", MenuItem);

// GET all menu items (for customer + admin)
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

// ADD new item (WITH IMAGE UPLOAD)
const addMenuItem = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const item = await MenuItem.create({
      name,
      price,
      category,
      image: req.file.filename, // 👈 store uploaded image filename
      available: true,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add menu item" });
  }
};

// TOGGLE availability
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.available = !item.available;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability" });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  toggleAvailability,
};
