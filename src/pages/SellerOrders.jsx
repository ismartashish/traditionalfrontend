import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import OrderStatusStepper from "../components/OrderStatusStepper";
import { socket } from "../socket";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ FETCH SELLER ORDERS
  useEffect(() => {
    if (!token) return;

    api
      .get("/orders/seller", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [token]);

  // ✅ UPDATE STATUS
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Order marked as ${status}`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );

      // 🔔 notify buyer
      socket.emit("orderUpdated", { orderId, status });
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="p-8">Loading orders...</p>;
  if (!orders.length)
    return <p className="p-8">No orders received</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        📦 Orders Received
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow p-5 mb-6"
        >
          {/* CUSTOMER */}
          <div className="mb-3">
            <p className="font-semibold">
              {order.customer?.name}
            </p>
            <p className="text-sm text-gray-500">
              {order.customer?.email}
            </p>
          </div>

          {/* STATUS */}
          <OrderStatusStepper status={order.status} />

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {order.status === "Request Sent" && (
              <button
                onClick={() =>
                  updateStatus(order._id, "Accepted")
                }
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Accept
              </button>
            )}

            {order.status === "Accepted" && (
              <button
                onClick={() =>
                  updateStatus(order._id, "Shipped")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ship
              </button>
            )}

            {order.status === "Shipped" && (
              <button
                onClick={() =>
                  updateStatus(order._id, "Delivered")
                }
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Deliver
              </button>
            )}
          </div>

          {/* ITEMS */}
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 mt-4 border-t pt-4"
            >
              <img
                src={`https://traditionalbackend-1.onrender.com${item.product?.images?.[0]}`}
                className="h-16 w-16 rounded object-cover"
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
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
