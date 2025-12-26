import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: { fontSize: "14px" }
  }}
/>

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <Toaster position="top-right" />
      <App />
    </AuthProvider>
  </Provider>
);
