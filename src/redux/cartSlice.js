import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || "guest";
  } catch {
    return "guest";
  }
};

const getCartKey = () => `cart_${getUserId()}`;

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(getCartKey())) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.find((x) => x._id === item._id);

      if (exist) {
        if (exist.quantity < item.stock) {
          exist.quantity += 1;
        }
      } else {
        state.push({ ...item, quantity: 1 });
      }

      saveCart(state);
    },

    increment: (state, action) => {
      const item = state.find((i) => i._id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
      saveCart(state);
    },

    decrement: (state, action) => {
      const item = state.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCart(state);
    },

    removeFromCart: (state, action) => {
      const updated = state.filter(
        (i) => i._id !== action.payload
      );
      saveCart(updated);
      return updated;
    },

    clearCart: () => {
      saveCart([]);
      return [];
    }
  }
});

export const {
  addToCart,
  increment,
  decrement,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
