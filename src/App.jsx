import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ConfirmOrder from "./pages/ConfirmOrder";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import PurchaseHistory from "./pages/PurchaseHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import SellerDashboard from "./pages/SellerDashboard";
import SellerOrders from "./pages/SellerOrders";
import AdminDashboard from "./pages/AdminDashboard";
import SearchResults from "./pages/SearchResults";
import FloatingSlogan from "./components/FloatingSlogan";
/* ===== HELPERS ===== */
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

/* ===== GUARDS ===== */
const SellerRoute = ({ children }) => {
  const user = getUser();
  return user?.role === "seller" ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = getUser();
  return user?.role === "admin" ? children : <Navigate to="/" />;
};

/* ===== FLOATING BANNER ===== */
function UnderProgress() {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
      🚧 This site is under progress
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <UnderProgress />
     <FloatingSlogan /> 
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/products" element={<Products />} />
        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <SellerRoute>
              <SellerOrders />
            </SellerRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
