import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { bot: "Hi 👋 I’m Bharat Assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { user: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://traditionalbackend-1.onrender.com/api/chat",
        { message: userMessage }
      );

      setMessages((prev) => [
        ...prev,
        { bot: res.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { bot: "Server busy 😅 try again" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-16 right-5 w-80 bg-white shadow-xl rounded-xl flex flex-col">
          
          {/* Header */}
          <div className="bg-orange-600 text-white p-3 rounded-t-xl">
            Bharat Assistant 🇮🇳
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.user && (
                  <div className="text-right">
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {msg.user}
                    </span>
                  </div>
                )}
                {msg.bot && (
                  <div className="text-left">
                    <span className="bg-orange-100 px-2 py-1 rounded">
                      {msg.bot}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {loading && <p className="text-gray-400">Typing...</p>}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border px-2 py-1 rounded"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-orange-600 text-white px-3 rounded"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}