import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


/* ================= MAIN DASHBOARD ================= */
export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-7xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          🏪 Seller Dashboard
        </h2>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {[
            { key: "add", label: "➕ Add Product" },
            { key: "products", label: "📦 My Products" },
            { key: "sales", label: "📊 Analytics" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === tab.key
                  ? "bg-orange-600 text-white shadow"
                  : "bg-white border hover:bg-orange-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === "add" && <AddProduct />}
        {activeTab === "products" && <MyProducts />}
        {activeTab === "sales" && <SalesAnalytics />}
      </div>
    </div>
  );
}


/* ================= QUICK STATS ================= */

function QuickStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/orders/seller/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Orders" value={stats.totalOrders} />
      <StatCard label="Total Sales" value={`₹${stats.totalSales}`} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ================= ADD PRODUCT ================= */

function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    state: "",
    category: "",
    description: "",
    stock: ""
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImages = (files) => {
    setImages([...files]);
    setPreview(
      [...files].map((file) => URL.createObjectURL(file))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) =>
        data.append(key, form[key])
      );
      images.forEach((img) => data.append("images", img));

      const token = localStorage.getItem("token");

      await api.post("/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Product added successfully 🎉");

      setForm({
        title: "",
        price: "",
        state: "",
        category: "",
        description: "",
        stock: ""
      });
      setImages([]);
      setPreview([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mx-auto max-w-3xl p-8 rounded-2xl shadow space-y-4"
    >
      <h3 className="text-xl font-semibold">
        Add New Product
      </h3>

      <input
        placeholder="Product Title"
        className="input"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Price (₹)"
          className="input"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Stock"
          className="input"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
          required
        />
      </div>

      <select
        className="input"
        value={form.state}
        onChange={(e) =>
          setForm({ ...form, state: e.target.value })
        }
        required
      >
        <option value="">Select State</option>
        <option>Bihar</option>
        <option>Uttar Pradesh</option>
        <option>Rajasthan</option>
        <option>West Bengal</option>
        <option>Tamil Nadu</option>
        <option>Gujarat</option>
        <option>Karnataka</option>
        <option>Punjab</option>
        <option>Odisha</option>
        <option>Assam</option>
        <option>Jharkhand</option>
        <option>Haryana</option>
        <option>Kerala</option>
        <option>Madhya Pradesh</option>
        <option>Chhattisgarh</option>
        <option>Telangana</option>
        <option>Andhra Pradesh</option>
        <option>Goa</option>
        <option>Manipur</option>
        <option>Meghalaya</option>
        <option>Nagaland</option>
        <option>Sikkim</option>
        <option>Tripura</option>
        <option>Arunachal Pradesh</option>
        <option>Mizoram</option>
        <option>Delhi</option>
        <option>Jammu and Kashmir</option>
        <option>Ladakh</option>
        <option>Chandigarh</option>
        <option>Andaman and Niccobar</option>
      </select>

      <select
        className="input"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        required
      >
        <option value="">Select Category</option>
        <option>Handloom</option>
        <option>Painting</option>
        <option>Jewellery</option>
        <option>Home Decor</option>
        <option>Pottery</option>
      </select>

      <textarea
        rows="3"
        placeholder="Description"
        className="input"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleImages(e.target.files)}
        required
      />

      {preview.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-20 w-20 object-cover rounded"
            />
          ))}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}

/* ================= MY PRODUCTS ================= */

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/products/my", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500">
        Loading products...
      </p>
    );

  if (!products.length)
    return (
      <p className="text-center text-gray-500">
        No products added yet
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
        >
          <img
            src={`http://localhost:5000${p.images[0]}`}
            className="h-40 w-full object-cover rounded"
          />

          <h3 className="font-semibold mt-2">
            {p.title}
          </h3>

          <p className="text-sm text-gray-600">
            ₹{p.price}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
              p.stock <= 5
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Stock: {p.stock}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================= SALES ANALYTICS ================= */

function SalesAnalytics() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("monthly"); // monthly | yearly | lifetime

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/orders/seller/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setData(res.data))
      .catch(() =>
        toast.error("Failed to load analytics")
      );
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  /* ===== FORMAT DATA ===== */

  const yearlyData = Object.keys(data.yearly).map(
    (year) => ({
      name: year,
      sales: data.yearly[year]
    })
  );

  const monthlyData = Object.keys(data.monthly)
    .sort()
    .map((key) => ({
      name: key, // 2025-1, 2025-2
      sales: data.monthly[key]
    }));

  const totalOrders = data.totalOrders; // backend se aana chahiye
  const totalSales = data.lifetimeSales;

  return (
    <div className="space-y-10">

      {/* ================= TOP SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-orange-600">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Sales</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{totalSales}
          </p>
        </div>
      </div>

      {/* ================= TOGGLE ================= */}
      <div className="flex justify-center gap-4 flex-wrap">
        {[
          { key: "monthly", label: "📈 Monthly" },
          { key: "yearly", label: "📊 Yearly" },
          { key: "lifetime", label: "💰 Lifetime" }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setView(btn.key)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              view === btn.key
                ? "bg-orange-600 text-white shadow"
                : "bg-white border hover:bg-orange-50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ================= GRAPH AREA ================= */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* MONTHLY */}
        {view === "monthly" && (
          <>
            <h3 className="font-semibold mb-4">
              Monthly Sales
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {/* YEARLY */}
        {view === "yearly" && (
          <>
            <h3 className="font-semibold mb-4">
              Yearly Sales
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* LIFETIME */}
        {view === "lifetime" && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Lifetime Earnings
            </p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              ₹{totalSales}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
