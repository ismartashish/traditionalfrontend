import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    api
      .get(`/products?search=${query}`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        🔍 Results for "{query}"
      </h2>

      {loading && <p>Searching products...</p>}

      {!loading && products.length === 0 && (
        <p className="text-gray-500">
          No products found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={`https://traditionalbackend.onrender.com${p.images[0]}`}
              className="h-48 w-full object-cover rounded-t-xl"
            />

            <div className="p-4">
              <p className="font-semibold line-clamp-1">
                {p.title}
              </p>

              <p className="text-sm text-gray-500">
                📍 {p.state}
              </p>

              <p className="mt-2 text-orange-600 font-bold">
                ₹{p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
