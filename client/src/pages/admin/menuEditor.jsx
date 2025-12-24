import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AdminNavbar from "../../components/admin/adminNavbar";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  Utensils,
  AlertCircle,
  Filter,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

const MenuEditor = () => {
  // STATE
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // FILTERS
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // FORM
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // FETCH MENU ITEMS
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5001/api/menu");
      setMenuItems(res.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS ---

  const toggleAvailability = async (id) => {
    try {
      // Optimistic Update
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, available: !item.available } : item,
        ),
      );
      await axios.patch(`http://localhost:5001/api/menu/${id}/toggle`);
    } catch (error) {
      console.error("Error toggling availability:", error);
      fetchMenuItems(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      image: null, // Keep null unless they upload a new one
    });
    // Set preview to existing image from server
    setImagePreview(`http://localhost:5001${item.image}`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setForm({ name: "", price: "", category: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.price || !form.category) {
      alert("Please fill in all text fields.");
      return;
    }
    // If adding new, image is required. If editing, image is optional.
    if (!isEditing && !form.image) {
      alert("Please upload an image for the new dish.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("price", Number(form.price));
      formData.append("category", form.category.trim());
      if (form.image) {
        formData.append("image", form.image);
      }

      let res;
      if (isEditing) {
        // UPDATE EXISTING (PUT)
        res = await axios.put(
          `http://localhost:5001/api/menu/${editId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        setMenuItems((prev) =>
          prev.map((item) => (item._id === editId ? res.data : item)),
        );
      } else {
        // CREATE NEW (POST)
        res = await axios.post("http://localhost:5001/api/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMenuItems((prev) => [res.data, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FILTERS ---
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((item) => item.category));
    return ["All", ...Array.from(cats)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-orange-500/30">
      <AdminNavbar />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              MENU <span className="text-orange-500">EDITOR</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage dishes, pricing, and availability
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95"
          >
            <Plus size={18} /> Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for a dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1d23] border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-orange-500 outline-none transition-all shadow-xl"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1a1d23] border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white appearance-none focus:border-orange-500 outline-none transition-all shadow-xl cursor-pointer font-bold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1d23] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#16191e]">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Item Details
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    Category
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    Price
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6">
                        <div className="h-12 w-48 bg-slate-800 rounded-xl"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-6 w-20 bg-slate-800 rounded-lg mx-auto"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-6 w-16 bg-slate-800 rounded-lg mx-auto"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-8 w-24 bg-slate-800 rounded-lg mx-auto"></div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-8 w-20 bg-slate-800 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500 overflow-hidden">
                            {item.image ? (
                              <img
                                src={`http://localhost:5001${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Utensils size={20} />
                            )}
                          </div>
                          <span className="font-bold text-white text-lg">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-4 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 border border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center font-black text-xl text-white">
                        ₹{item.price}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => toggleAvailability(item._id)}
                          className={`cursor-pointer flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 ${
                            item.available
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          <Power size={14} />{" "}
                          {item.available ? "In Stock" : "Sold Out"}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer shadow-lg active:scale-95"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer shadow-lg active:scale-95"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle
                          className="text-slate-700 mb-4"
                          size={48}
                        />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                          No items found matching "{searchTerm}"
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d23] w-full max-w-lg rounded-3xl p-8 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative w-full h-32 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center hover:border-orange-500 hover:bg-slate-800/50 transition-all group cursor-pointer overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="p-3 bg-slate-800 rounded-full text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all mb-2">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Upload Dish Image
                    </p>
                  </>
                )}
              </div>

              <input
                placeholder="Item Name"
                className="w-full bg-[#0f1115] border border-slate-800 p-4 rounded-xl text-white focus:border-orange-500 outline-none font-bold"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="flex gap-4">
                <input
                  placeholder="Price (₹)"
                  type="number"
                  className="w-1/2 bg-[#0f1115] border border-slate-800 p-4 rounded-xl text-white focus:border-orange-500 outline-none font-bold"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  placeholder="Category"
                  className="w-1/2 bg-[#0f1115] border border-slate-800 p-4 rounded-xl text-white focus:border-orange-500 outline-none font-bold"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
