import { useEffect, useState } from "react";
import api from "../services/api";
import OrderStatusStepper from "../components/OrderStatusStepper";

export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-8">Loading orders...</p>;

  if (!orders.length)
    return (
      <div className="p-8 text-center text-gray-500">
        No purchases yet
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        🧾 Purchase History
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow mb-5 p-5"
        >
          <p className="text-sm text-gray-500">
            Order #{order._id.slice(-6)}
          </p>

          <OrderStatusStepper status={order.status} />

          <p className="mt-2 font-semibold">
            Total: ₹{order.totalAmount}
          </p>
        </div>
      ))}
    </div>
  );
}
