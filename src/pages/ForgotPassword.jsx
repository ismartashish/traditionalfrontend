import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    toast.success("Reset link sent");
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white shadow">
      <input
        placeholder="Email"
        className="w-full p-3 border"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="w-full bg-orange-600 text-white py-2 mt-4">
        Send Reset Link
      </button>
    </form>
  );
}
