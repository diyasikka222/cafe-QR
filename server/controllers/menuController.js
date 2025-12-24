const MenuItem = require("../models/MenuItem");

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new menu item
const addMenuItem = async (req, res) => {
  const { name, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const newItem = new MenuItem({
      name,
      price,
      category,
      image,
      available: true,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Toggle Availability
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    let updateData = { name, price, category };

    // Only update image if a new file is sent
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  toggleAvailability,
  deleteMenuItem,
  updateMenuItem,
};
