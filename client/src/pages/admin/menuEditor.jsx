import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const MenuEditor = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  /* ===============================
     FETCH MENU ITEMS FROM DB
  =============================== */
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/menu")
      .then((res) => setMenuItems(res.data))
      .catch(console.error);
  }, []);

  /* ===============================
     TOGGLE AVAILABILITY (DB)
  =============================== */
  const toggleAvailability = async (id) => {
    const res = await axios.patch(
      `http://localhost:5001/api/menu/${id}/toggle`,
    );

    setMenuItems((prev) =>
      prev.map((item) => (item._id === id ? res.data : item)),
    );
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
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
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} /> Add New Item
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
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

        {/* Menu Table */}
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
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                          <Utensils size={20} />
                        </div>
                        <span className="font-bold text-white text-lg">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-xl text-white">
                      ₹{item.price}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                          item.available
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        <Power size={14} />
                        {item.available ? "In Stock" : "Sold Out"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-slate-800 hover:bg-blue-500 text-slate-400 hover:text-white rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-[#1a1d23] rounded-[2.5rem] mt-8 border border-dashed border-slate-800">
            <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              No items found matching "{searchTerm}"
            </p>
          </div>
        )}
      </main>

      {/* ADD ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1d23] w-full max-w-lg rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-black mb-6">Add New Item</h2>

            <input
              placeholder="Item Name"
              className="w-full mb-4 bg-slate-800 p-3 rounded-xl"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Price"
              type="number"
              className="w-full mb-4 bg-slate-800 p-3 rounded-xl"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full mb-4 bg-slate-800 p-3 rounded-xl"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
            <input
              placeholder="Category (existing or new)"
              className="w-full mb-6 bg-slate-800 p-3 rounded-xl"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <div className="flex justify-end gap-4">
              {/* ✅ FIXED CANCEL BUTTON */}
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-xl font-black border border-slate-700 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>

              {/* ✅ FIXED IMAGE UPLOAD (FormData) */}
              <button
                onClick={async () => {
                  try {
                    if (
                      !form.name ||
                      !form.price ||
                      !form.category ||
                      !form.image
                    ) {
                      alert("All fields are required");
                      return;
                    }

                    const formData = new FormData();
                    formData.append("name", form.name.trim());
                    formData.append("price", Number(form.price)); // critical
                    formData.append("category", form.category.trim());
                    formData.append("image", form.image);

                    const res = await axios.post(
                      "http://localhost:5001/api/menu",
                      formData,
                      { headers: { "Content-Type": "multipart/form-data" } },
                    );

                    setMenuItems((prev) => [res.data, ...prev]);
                    setShowModal(false);
                  } catch (err) {
                    console.error("ADD MENU ITEM ERROR:", err);
                  }
                }}
                className="bg-orange-500 px-6 py-2 rounded-xl font-black"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
