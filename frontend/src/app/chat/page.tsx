"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatInterface = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async () => {
    if (!msg.trim()) return;

    const newMsg: Message = { sender: "user", text: msg };
    setMessages((prev) => [...prev, newMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMsg.text }),
      });

      const data = await res.json();
      const botReply: Message = {
        sender: "bot",
        text: data.reply || "No response from model.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error calling Groq API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Insight Analyst</h1>
        <p className="text-gray-400">How can we help you today?</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-lg px-4 py-2 rounded-2xl ${
              m.sender === "user"
                ? "ml-auto bg-blue-600"
                : "mr-auto bg-gray-700"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-black border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <textarea
            value={msg}
            onChange={handleInputChange}
            rows={1}
            className="flex-1 resize-none p-2 rounded-xl bg-gray-700 text-white focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
