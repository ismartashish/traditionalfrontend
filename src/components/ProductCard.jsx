import { useDispatch } from "react-redux";
import { addToCart, clearCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imageUrl =
    product.images?.length > 0
      ? `https://traditionalbackend-1.onrender.com${product.images[0]}`
      : "/no-image.png";

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }

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

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }

    dispatch(clearCart());
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: imageUrl,
        stock: product.stock
      })
    );

    navigate("/checkout");
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col">
      {/* IMAGE */}
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.title}
          className="h-48 w-full object-cover rounded-t-xl"
        />
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold line-clamp-2 hover:underline">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mt-1">
          📍 {product.state}
        </p>

        {/* PRICE + STOCK */}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-orange-600 font-bold text-lg">
            ₹{product.price}
          </span>

          {outOfStock ? (
            <span className="text-red-600 text-xs">
              Out of stock
            </span>
          ) : lowStock ? (
            <span className="text-yellow-600 text-xs">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-green-600 text-xs">
              In stock ({product.stock})
            </span>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-3 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-full py-2 rounded text-white ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className={`w-full py-2 rounded border ${
              outOfStock
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-orange-600 text-orange-600 hover:bg-orange-50"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
