import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const search = searchParams.get("search");

  useEffect(() => {
    let url = "/products?";
    if (category) url += `category=${category}&`;
    if (state) url += `state=${state}&`;
    if (search) url += `search=${search}`;

    api.get(url).then((res) => setProducts(res.data));
  }, [category, state, search]);

  if (!products.length) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No products found
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <Link
          key={p._id}
          to={`/product/${p._id}`}
          className="bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <img
            src={`https://traditionalbackend-1.onrender.com${p.images[0]}`}
            className="h-48 w-full object-cover rounded-t-xl"
          />
          <div className="p-4">
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-gray-500">📍 {p.state}</p>
            <p className="text-orange-600 font-bold mt-1">
              ₹{p.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
