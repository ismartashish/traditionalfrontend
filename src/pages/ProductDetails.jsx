import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

/* ================= PRODUCT DETAILS ================= */

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔁 FETCH PRODUCT */
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!product) return <p className="p-8">Product not found</p>;

  const imageUrl =
    product.images?.length > 0
      ? `https://traditionalbackend-1.onrender.com${product.images[0]}`
      : "/no-image.png";

  const outOfStock = product.stock <= 0;

  const addItem = () => {
    if (outOfStock) return toast.error("Out of stock");

    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: imageUrl,
        stock: product.stock
      })
    );

    toast.success("Added to cart");
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">

      {/* ================= TOP SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <img
          src={imageUrl}
          className="h-96 w-full object-cover rounded-xl shadow"
        />

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-600 mt-2">
            {product.description}
          </p>

          <p className="text-lg text-gray-500 mt-3">
            📍 {product.state}
          </p>

          <p className="text-3xl text-orange-600 font-bold mt-4">
            ₹{product.price}
          </p>

          {/* ⭐ AVERAGE RATING (AS IT IS) */}
          <div className="flex items-center gap-2 mt-2">
            <Stars rating={product.rating || 0} />
            <span className="text-sm text-gray-500">
              {product.numReviews || 0} reviews
            </span>
          </div>

          {/* STOCK */}
          <p
            className={`mt-2 font-medium ${
              outOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : `In stock (${product.stock} available)`}
          </p>

          <button
            onClick={addItem}
            disabled={outOfStock}
            className={`mt-6 px-8 py-3 rounded text-white ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ================= WRITE REVIEW (IMAGE KE NICHE) ================= */}
      {user && (
        <div className="max-w-3xl">
          <ReviewForm
            productId={product._id}
            onAdded={fetchProduct}
          />
        </div>
      )}

      {/* ================= STAR SUMMARY ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h3 className="font-semibold text-lg mb-2">
          ⭐ Customer Ratings
        </h3>

        <div className="flex items-center gap-3">
          <Stars rating={product.rating || 0} />
          <span className="text-gray-600">
            Average rating from {product.numReviews || 0} reviews
          </span>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-3xl">
        <Reviews product={product} reload={fetchProduct} />
      </div>
    </div>
  );
}

/* ================= STARS ================= */

function Stars({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ================= REVIEW FORM ================= */

function ReviewForm({ productId, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/reviews/${productId}`,
        { rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added");
      setComment("");
      onAdded();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">
        Write a Review
      </h3>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded w-full"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <textarea
        className="w-full border p-2 mt-3 rounded"
        placeholder="Your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submit}
        className="mt-4 bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
      >
        Submit Review
      </button>
    </div>
  );
}

/* ================= REVIEWS LIST ================= */

function Reviews({ product, reload }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!product.reviews?.length) {
    return (
      <p className="text-gray-500">
        No reviews yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        Reviews
      </h3>

      {product.reviews.map((r) => (
        <div
          key={r._id}
          className="bg-gray-50 p-4 rounded"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{r.name}</p>
              <Stars rating={r.rating} />
            </div>

            {(user?._id === r.user ||
              user?.role === "seller") && (
              <button
                onClick={async () => {
                  const token =
                    localStorage.getItem("token");

                  await api.delete(
                    `/reviews/${product._id}/${r._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                  );

                  reload();
                }}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>

          <p className="mt-2">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
