function SalesAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/orders/seller/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setStats(res.data))
      .catch(() =>
        toast.error("Failed to load analytics")
      );
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  const chartData = [
    { name: "Orders", value: stats.totalOrders },
    { name: "Sales ₹", value: stats.totalSales }
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-6 text-center">
          📊 Sales Analytics
        </h3>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-center">
          <div>
            <p className="text-gray-500">
              Total Orders
            </p>
            <p className="text-2xl font-bold">
              {stats.totalOrders}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Total Sales
            </p>
            <p className="text-2xl font-bold">
              ₹{stats.totalSales}
            </p>
          </div>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
