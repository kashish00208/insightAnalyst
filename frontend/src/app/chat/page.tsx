"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatInterface = () => {
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "File uploaded successfully." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "File upload failed." },
      ]);
    } finally {
      setFile(null); 
    }
  };

  const handleSubmit = async () => {
    if (!msg.trim()) return;

    const userMessage: Message = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMessage]);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();
      const botReply: Message = {
        sender: "bot",
        text: data.response || " No response from model.",
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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-black text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 h-20 md:h-screen p-4 border-r border-gray-700 flex md:flex-col items-center md:items-start justify-between md:justify-start">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Insight Analyst</h1>
      </aside>

      {/* Chat Interface */}
      <main className="w-full md:w-3/4 h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                m.sender === "user"
                  ? "ml-auto bg-slate-900"
                  : "mr-auto bg-gray-700"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-black border-t border-gray-700 sticky bottom-0">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
                if (selectedFile) {
                  handleFileUpload();
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="p-1 hover:opacity-80 invert"
            >
              <Image src="/file.png" width={20} height={20} alt="file-icon" />
            </button>

            {/* Textarea */}
            <textarea
              value={msg}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 resize-none p-2 rounded-xl bg-gray-800 text-white focus:outline-none"
              placeholder="Type your message (Shift+Enter for newline)..."
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded-xl transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-slate-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
