import { useState, useRef, useEffect } from 'react';
import { useChat } from '../features/ai-assistant/hooks/useChat';

export function AIAssistant() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Basic markdown bold parsing for **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
          <br />
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-[slideIn_0.3s_ease-out]">
      <header className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">AI Konsultan</h2>
        <p className="text-sm text-ai-text-muted">Diskusikan kondisi finansial Anda secara personal dengan AI.</p>
      </header>

      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                msg.role === 'user' 
                ? 'bg-ai-primary text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-ai-text-primary rounded-tl-sm shadow-sm'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <span className="text-lg">🤖</span>
                    <span className="text-xs font-bold text-ai-primary uppercase tracking-wider">AI Core 4.0</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed">
                  {renderMessageContent(msg.content)}
                </div>
                <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-ai-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soal saldo, anggaran, atau minta tips hemat..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ai-text-primary focus:outline-none focus:ring-2 focus:ring-ai-primary/20 focus:border-ai-primary transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-ai-primary hover:bg-ai-primary/90 disabled:opacity-50 text-white rounded-xl px-6 py-3 font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Kirim
              <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
