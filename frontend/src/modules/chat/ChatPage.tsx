import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { MessageSquareShare, Send, User, Cpu } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', message: 'Hello! I am the ASCIP Smart City AI Agent. Ask me anything about traffic congestion, water systems, power loads, or air quality!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', message: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'ai', message: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquareShare className="text-purple-400" /> ASCIP Smart Assistant
          </h2>
          <p className="text-sm text-gray-400">Ask the AI agent about city status, environmental quality, or utilities performance.</p>
        </div>
      </div>

      <Card className="h-[500px] flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg text-white">
                  <Cpu className="w-4 h-4" />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-sm max-w-md ${
                m.sender === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                <p>{m.message}</p>
              </div>
              {m.sender === 'user' && (
                <div className="bg-white/10 p-2 rounded-lg text-white">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg text-white animate-pulse">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-sm text-gray-400 rounded-tl-none animate-pulse">
                Assistant is thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-3 pt-3 border-t border-white/10">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query about traffic speed, green energy, leaks..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button 
            type="submit"
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </Card>
    </div>
  );
};
