import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  removeFromCart
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const outOfStockItem = cart.find(
    (i) => i.stock === 0 || i.quantity > i.stock
  );

  if (cart.length === 0)
    return <p className="p-8">Cart is empty</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-4 bg-white p-4 rounded shadow mb-4"
        >
          <img
            src={item.image}
            className="h-20 w-20 object-cover"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p>₹{item.price}</p>

            {item.stock === 0 && (
              <p className="text-red-600 text-sm">
                Out of stock
              </p>
            )}

            {item.quantity > item.stock && (
              <p className="text-red-600 text-sm">
                Only {item.stock} left
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(decrement(item._id))}
              className="px-2 bg-gray-200 rounded"
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => dispatch(increment(item._id))}
              className="px-2 bg-gray-200 rounded"
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>

          <button
            onClick={() =>
              dispatch(removeFromCart(item._id))
            }
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      {outOfStockItem && (
        <p className="text-red-600 mt-4 text-sm">
          ⚠️ Remove or update out-of-stock items to proceed
        </p>
      )}

      <div className="text-right mt-6">
        <p className="text-xl font-bold">Total: ₹{total}</p>

        <button
          onClick={() => navigate("/checkout")}
          disabled={outOfStockItem}
          className={`mt-4 px-6 py-2 rounded ${
            outOfStockItem
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
