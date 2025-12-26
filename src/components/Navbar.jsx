import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import api from "../services/api";

export default function Navbar() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  /* 🔍 SEARCH */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const profileImage = user?.profileImage
    ? `https://traditionalbackend.onrender.com${user.profileImage}`
    : "/public/categories/avatar.png";

  const handleLogout = () => {
    logout();
    dispatch(clearCart());
    navigate("/login");
  };

  /* CLOSE DROPDOWNS ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* SEARCH (HALF WORD / STATE / NAME) */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(
          `/products?search=${encodeURIComponent(query)}`
        );
        setResults(res.data.slice(0, 6));
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className="sticky top-0 z-50 bg-orange-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-wide">
            Bharat Traditions
          </span>
        </Link>

        {/* SEARCH BAR (DESKTOP ONLY) */}
        <div
          ref={searchRef}
          className="relative hidden md:block w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Search product, state, craft..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full text-black outline-none"
          />

          {results.length > 0 && (
            <div className="absolute w-full bg-white text-black mt-2 rounded-xl shadow-lg overflow-hidden">
              {results.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    📍 {p.state} • {p.category}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          {/* CART */}
          <Link to="/cart" className="relative font-medium">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-orange-600 px-2 rounded-full text-xs font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="bg-white text-orange-600 px-4 py-1 rounded font-semibold"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/my-orders" className="font-medium">
                My Orders
              </Link>

              {/* 3 DOT MENU */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="text-2xl px-2"
                >
                  ⋮
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 bg-white text-black rounded-xl shadow-lg w-56 overflow-hidden">

                    {/* USER HEADER */}
                    <div className="px-4 py-3 border-b flex items-center gap-3">
                      <img
                        src={profileImage}
                        className="h-10 w-10 rounded-full object-cover"
                        alt="profile"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* HOME BUTTON (NEW) */}
                    <Item
                      label="🏠 Home"
                      onClick={() => {
                        navigate("/");
                        setOpen(false);
                      }}
                    />

                    {/* SELLER BADGE */}
                    {user.role === "seller" && (
                      <div className="px-4 py-2 bg-orange-50 text-orange-700 text-sm font-medium">
                        🏪 Seller Partner
                      </div>
                    )}

                    <Item label="👤 My Profile" onClick={() => navigate("/profile")} />
                    <Item label="⚙️ Settings" onClick={() => navigate("/settings")} />
                    <Item label="🧾 Purchase History" onClick={() => navigate("/purchase-history")} />

                    {user.role === "seller" && (
                      <>
                        <div className="border-t my-1" />
                        <Item label="🏪 Seller Dashboard" onClick={() => navigate("/seller")} />
                        <Item label="📦 Orders Received" onClick={() => navigate("/seller/orders")} />
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 border-t"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

/* REUSABLE ITEM */
function Item({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
