import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ChatbotProvider>
          
          {/* 🔥 YOUR APP */}
          <App />

          {/* 🔔 TOAST */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontSize: "14px" },
            }}
          />

        </ChatbotProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);