import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    gstNumber: "",
    phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        ...form,
        isSeller
      });

      const loginRes = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(loginRes.data.user)
      );

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Create Account
        </h2>

        <input
          id="register-name"
          name="name"
          autoComplete="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          required
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          id="register-email"
          name="email"
          autoComplete="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          id="register-password"
          name="password"
          autoComplete="new-password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isSeller}
            onChange={(e) =>
              setIsSeller(e.target.checked)
            }
          />
          Register as Seller
        </label>

        {isSeller && (
          <div className="space-y-2 bg-orange-50 p-3 rounded">
            <input
              id="shop-name"
              name="shopName"
              placeholder="Shop Name"
              className="w-full p-2 border rounded"
              required
              onChange={(e) =>
                setForm({ ...form, shopName: e.target.value })
              }
            />
            <input
              id="seller-phone"
              name="phone"
              autoComplete="tel"
              placeholder="Phone"
              className="w-full p-2 border rounded"
              required
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <input
              id="seller-address"
              name="address"
              autoComplete="street-address"
              placeholder="Address"
              className="w-full p-2 border rounded"
              required
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p
          className="text-center text-sm text-orange-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
