import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Bot, User, MessageCircle, X } from 'lucide-react';
import axios from 'axios';

const Chatwindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me about any crypto coin." }
  ]);
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [input, setinput] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setinput("");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { message: userText });
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Something Went Wrong please try again later!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-[#d0b345] to-[#b8993a] shadow-2xl hover:shadow-[#d0b345]/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-zinc-900" />
        ) : (
          <MessageCircle className="w-7 h-7 text-zinc-900" />
        )}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-zinc-900 animate-pulse"></div>
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[600px] flex flex-col bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden z-50 animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="w-full px-6 py-4 bg-gradient-to-r from-[#d0b345] to-[#b8993a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h3 className='text-lg font-bold text-zinc-900'>Crypto Assistant</h3>
                <p className='text-xs text-zinc-800'>AI-powered insights</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-900/20 hover:bg-zinc-900/30 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-zinc-900" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {message.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-[fadeIn_0.3s_ease-in]`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#d0b345] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#d0b345]/20">
                    <Bot className="w-5 h-5 text-zinc-900" />
                  </div>
                )}
                
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg transition-all hover:shadow-xl ${
                  msg.sender === "user" 
                    ? "bg-[#d0b345] text-zinc-900 rounded-br-sm font-medium" 
                    : "bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700"
                }`}>
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-5 h-5 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 justify-start animate-[fadeIn_0.3s_ease-in]">
                <div className="w-8 h-8 rounded-full bg-[#d0b345] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#d0b345]/20">
                  <Bot className="w-5 h-5 text-zinc-900" />
                </div>
                <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#d0b345] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#d0b345] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#d0b345] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <div className="flex gap-2 items-center bg-zinc-800 rounded-full px-2 py-2 border border-zinc-700 focus-within:border-[#d0b345] transition-all shadow-lg">
              <input 
                value={input} 
                onChange={(e) => setinput(e.target.value)} 
                onKeyDown={handleKeydown} 
                placeholder='Ask about any cryptocurrency...' 
                className='flex-1 bg-transparent px-4 py-1 text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-sm'
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()} 
                className='w-10 h-10 rounded-full bg-gradient-to-r from-[#d0b345] to-[#b8993a] hover:from-[#b8993a] hover:to-[#d0b345] text-zinc-900 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:shadow-[#d0b345]/30 active:scale-95'
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 text-center mt-2">Powered by AI • Real-time crypto insights</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-zinc-700::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </>
  );
};

export default Chatwindow;