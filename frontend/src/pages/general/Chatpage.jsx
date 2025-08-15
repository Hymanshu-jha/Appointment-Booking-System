import { useState } from "react";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "client",
      text: "Hi, I booked an appointment for tomorrow. Just wanted to confirm the details.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "provider",
      text: "Hello! Yes, your appointment is confirmed for tomorrow at 2:00 PM.",
      time: "10:32 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "client", text: input, time: "Now" },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 bg-gray-900 p-4 shadow-lg">
        <button className="p-2 rounded-full hover:bg-purple-800 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">John Doe (Provider)</h2>
          <p className="text-sm text-gray-300">Online</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg shadow-md ${
                msg.sender === "client"
                  ? "bg-sky-600 text-white rounded-br-none"
                  : "bg-purple-800 text-white rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-xs text-gray-300 mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center p-4 border-t border-gray-800 bg-black sticky bottom-0">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-sky-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-3 p-2 rounded-lg bg-sky-600 hover:bg-sky-700 transition-colors"
          onClick={handleSend}
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
