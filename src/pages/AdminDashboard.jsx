export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Manage Products</h3>
          <p>Approve / remove listings</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Manage Sellers</h3>
          <p>Verify sellers</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">View Orders</h3>
          <p>Monitor all orders</p>
        </div>
      </div>
    </div>
  );
}
