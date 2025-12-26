import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import OrderStatusStepper from "../components/OrderStatusStepper";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch(() => {
        toast.error("Failed to load orders");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="p-6">No orders yet</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📦 My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className={`bg-white rounded-xl shadow p-5 mb-6 ${
            order.status === "Cancelled" ? "opacity-70" : ""
          }`}
        >
          {/* ORDER ID */}
          <p className="text-sm text-gray-500 mb-2">
            Order #{order._id.slice(-6)}
          </p>

          {/* STATUS STEPPER */}
          <OrderStatusStepper status={order.status} />

          {/* ORDER ITEMS */}
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-t pt-3"
              >
                <img
                  src={`https://traditionalbackend.onrender.com${item.product?.images?.[0]}`}
                  alt={item.product?.title}
                  className="w-16 h-16 rounded object-cover border"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>{order.status !== "Delivered" &&
 order.status !== "Cancelled" && (
  <button
    onClick={async () => {
      try {
        await api.put(`/orders/${order._id}/cancel`);
        toast.success("Order cancelled");

        setOrders(prev =>
          prev.map(o =>
            o._id === order._id
              ? { ...o, status: "Cancelled" }
              : o
          )
        );
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Cancel failed"
        );
      }
    }}
    className="mt-3 text-sm text-red-600 hover:underline"
  >
    Cancel Order
  </button>
)}

              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-4 border-t pt-3">
            <p className="font-semibold text-lg">
              Total ₹{order.totalAmount}
            </p>

            {order.status === "Cancelled" && (
              <span className="text-red-600 font-medium">
                ❌ Cancelled
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
