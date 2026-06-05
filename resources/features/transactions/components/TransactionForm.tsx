import { useState, useRef } from 'react';

interface Props {
  onSuccess: () => void;
  setToast: (msg: string) => void;
  processTransaction: (text: string) => Promise<any>;
}

export function TransactionForm({ onSuccess, setToast, processTransaction }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const res = await processTransaction(input);
      setToast('Transaksi dicatat: ' + res.data.description);
      setInput('');
      onSuccess();
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mb-12 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-ai-primary/20 to-ai-secondary/20 rounded-[24px] blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
      <form onSubmit={handleSubmit} className="relative bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-lg flex items-center p-2 transition-all focus-within:border-ai-primary/50 focus-within:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
        
        <div className="pl-4 pr-3 text-ai-primary flex-shrink-0">
          {loading ? (
            <svg className="w-6 h-6 animate-spin text-ai-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="w-full bg-transparent border-none text-ai-text-primary text-base md:text-lg px-2 py-4 outline-none placeholder-ai-text-muted disabled:opacity-50"
          placeholder="Ketik &quot;Beli kopi starbucks 50rb&quot; lalu tekan Enter..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="ml-2 flex-shrink-0 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-ai-text-primary font-semibold py-2 px-6 rounded-xl transition-all duration-300 border border-slate-200 flex items-center gap-2 group-focus-within:bg-ai-primary/10 group-focus-within:text-ai-primary group-focus-within:border-ai-primary/30"
        >
          Kirim
          <span className="hidden md:inline-block text-xs opacity-50 font-mono tracking-tighter">↵</span>
        </button>
      </form>
    </div>
  );
}
