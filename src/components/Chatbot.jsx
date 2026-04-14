import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useChatbot } from "../context/ChatbotContext";

export default function Chatbot() {
  const { open, setOpen } = useChatbot();

  const [messages, setMessages] = useState([
    { bot: "Hi 👋 I’m Bharat Assistant 🇮🇳. Ask me anything!" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // ✅ Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const API_URL = import.meta.env.VITE_API_URL;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    // Add user message
    setMessages((prev) => [...prev, { user: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/chat`,
        { message: userMessage }
      );

      setMessages((prev) => [
        ...prev,
        { bot: res.data?.reply || "No response 😅" }
      ]);

    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        { bot: "Server busy 😅 try again later" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* 📦 Chat Window */}
      {open && (
        <div className="fixed bottom-16 right-5 z-50 w-80 bg-white shadow-xl rounded-xl flex flex-col">

          {/* Header */}
          <div className="bg-orange-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span>Bharat Assistant 🇮🇳</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.user && (
                  <div className="text-right">
                    <span className="bg-gray-200 px-3 py-1 rounded-lg inline-block">
                      {msg.user}
                    </span>
                  </div>
                )}

                {msg.bot && (
                  <div className="text-left">
                    <span className="bg-orange-100 px-3 py-1 rounded-lg inline-block">
                      {msg.bot}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* ✅ Typing indicator */}
            {loading && (
              <div className="text-left">
                <span className="bg-orange-100 px-3 py-1 rounded-lg inline-block text-gray-500">
                  Typing...
                </span>
              </div>
            )}

            {/* ✅ Auto scroll target */}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders..."
              className="flex-1 border px-2 py-1 rounded text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}