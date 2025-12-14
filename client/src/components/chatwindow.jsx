import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me about any crypto coin." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { message: input });
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { sender: "bot", text: "Oops! Something went wrong." };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "500px",
          overflowY: "auto",
          background: "#f9f9f9"
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "20px",
                background: msg.sender === "user" ? "#007bff" : "#eee",
                color: msg.sender === "user" ? "#fff" : "#000",
                maxWidth: "80%"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me about crypto..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
