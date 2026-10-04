import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useConnectivity } from '../../context/ConnectivityContext';
import { usePersona } from '../../context/PersonaContext';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const OFFLINE_FAQS = [
  { q: "What are current conditions at Maitri Station?", a: "Maitri is India's second permanent research station in Antarctica. Coordinates: -70.76°S, 11.73°E." },
  { q: "Explain how to prepare NetCDF CTD data.", a: "To prepare NetCDF CTD data, ensure you have variables for temperature, salinity, and depth. Use Python libraries like `xarray` or `netCDF4` to process the profiles." },
  { q: "What are the environmental rules under the Madrid Protocol?", a: "The Madrid Protocol designates Antarctica as a 'natural reserve, devoted to peace and science'. It prohibits mining and sets strict rules on waste disposal and environmental protection." },
  { q: "Summarize the 43rd ISEA objectives.", a: "The 43rd ISEA objectives include sustaining Maitri and Bharati stations, conducting atmospheric and geological observations, and supporting global climate research." }
];

export const PolarisCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'Hello! I am POLARIS AI. How can I assist you with Polar Science today?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { mode, isOnline } = useConnectivity();
  const { persona } = usePersona();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    if (mode === 'OFFLINE_FIELD' || !isOnline) {
      // Try using Chrome Built-in AI (Gemini Nano) for true offline dynamic generation
      try {
        if ('ai' in window && 'languageModel' in (window as any).ai) {
          const session = await (window as any).ai.languageModel.create({
            systemPrompt: "You are POLARIS AI, an assistant for Polar Science (India's Antarctic/Arctic programs). Be concise, helpful, and use your built-in knowledge to answer the user's questions about Antarctica, science, and the environment."
          });
          const responseText = await session.prompt(text);
          setMessages([...newMessages, { role: 'assistant', content: responseText + '\n\n*(Generated offline by local AI)*' }]);
          setIsTyping(false);
          return;
        }
      } catch (e) {
        console.error("Local AI failed:", e);
      }

      // Final Offline static fallback
      setTimeout(() => {
        let answer = "I'm currently offline and local AI is unavailable in your browser. Please ask one of the cached FAQs (e.g., Maitri, NetCDF CTD data, Madrid Protocol, 43rd ISEA).";
        for (const faq of OFFLINE_FAQS) {
          if (text.toLowerCase().includes(faq.q.toLowerCase().split(' ')[2] || faq.q.toLowerCase())) {
            answer = faq.a;
            break;
          }
        }
        setMessages([...newMessages, { role: 'assistant', content: answer }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          persona: persona
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response || 'Sorry, I encountered an error.' }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I am POLARIS AI. How can I assist you with Polar Science today?' }]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#111111] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-5 h-5 text-[#5BB7A5]" />
        <span className="font-semibold text-sm">Ask POLARIS AI</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-[#FAFAF8] border border-[#E8E6E0] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-[#0D2735] text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-[#5BB7A5]" />
              <span className="font-bold font-serif">POLARIS AI Copilot</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={clearChat} className="p-1 hover:bg-white/10 rounded transition-colors" title="Clear Chat">
                <Trash2 className="w-4 h-4 text-[#8E8E91] hover:text-white" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Close">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#111111] text-white rounded-br-none' : 'bg-white border border-[#E8E6E0] text-[#111111] rounded-bl-none shadow-sm'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-p:leading-snug prose-a:text-[#2563EB] max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E8E6E0] p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#8E8E91] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#8E8E91] rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-[#8E8E91] rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-[#E8E6E0] bg-white">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {OFFLINE_FAQS.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(faq.q)}
                  className="bg-[#FAFAF8] border border-[#E8E6E0] hover:bg-[#F4F2EE] text-[10px] text-[#555558] px-2 py-1 rounded-full transition-colors whitespace-nowrap"
                >
                  {faq.q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'OFFLINE_FIELD' || !isOnline ? "Ask cached FAQs offline..." : "Ask about polar science..."}
                className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#111111] text-white rounded-lg disabled:opacity-50 hover:bg-[#222]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
