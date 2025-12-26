import { useContext, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: ""
  });

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await api.put("/users/update", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      login(res.data.user, token);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <form
        onSubmit={updateProfile}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold">Settings</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="New Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-orange-600 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
