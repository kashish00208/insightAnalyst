"use client";

import React, { useState } from "react";

const ChatInterface = () => {
  const [msg, setMsg] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async () => {
    if (!msg.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/groq-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setResponse(data.reply || "No response from model.");
    } catch (error) {
      console.error("Error calling Groq API:", error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Welcome to Insight Analyst</h1>
        <p className="text-gray-300">How can we help you today?</p>
      </div>

      <div className="flex">
        <textarea
          value={msg}
          onChange={handleInputChange}
          rows={1}
          className="w-full p-2 rounded-2xl bg-slate-700 text-white"
          placeholder="Type your message here..."
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className=" bg-blue-600 rounded-lg text-white"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {response && (
        <div className="p-4 bg-gray-800 text-white rounded-xl">
          <strong>Insight Analyst:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
