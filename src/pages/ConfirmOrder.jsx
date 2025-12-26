import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ConfirmOrder() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const shippingAddress = JSON.parse(
    localStorage.getItem("shippingAddress")
  );

  // 🔒 safety check
  useEffect(() => {
    if (!shippingAddress || !cart.length) {
      navigate("/cart");
    }
  }, []);

  const placeOrder = async () => {
    if (placing) return;

    try {
      setPlacing(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log("🔥 CALLING PLACE ORDER API");

      await api.post(
        "/orders",
        {
          items: cart.map((item) => ({
            product: item._id,
            quantity: item.quantity
          })),
          shippingAddress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ SUCCESS = ORDER BOOKED
      dispatch(clearCart());
      localStorage.removeItem("shippingAddress");

      toast.success("Order placed successfully 🎉");

      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Order placement failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Confirm Order
      </h2>

      {/* ADDRESS PREVIEW */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="font-medium">
          {shippingAddress?.name}
        </p>
        <p className="text-sm">
          {shippingAddress?.address},{" "}
          {shippingAddress?.city},{" "}
          {shippingAddress?.state} -{" "}
          {shippingAddress?.pincode}
        </p>
        <p className="text-sm">
          📞 {shippingAddress?.phone}
        </p>
      </div>

      {/* PLACE ORDER */}
      <button
        onClick={placeOrder}
        disabled={placing}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
