import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  if (!cart.length) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ save address
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(address)
    );

    // 🔥 move to confirm page
    navigate("/confirm-order");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold">Shipping Address</h2>

      {Object.keys(address).map((key) => (
        <input
          key={key}
          id={`shipping-${key}`}
          name={key}
          placeholder={key.toUpperCase()}
          className="w-full p-2 border rounded"
          value={address[key]}
          onChange={(e) =>
            setAddress({ ...address, [key]: e.target.value })
          }
          required
        />
      ))}

      <button className="w-full bg-orange-600 text-white py-2 rounded">
        Continue
      </button>
    </form>
  );
}
