import { useState } from 'react';

interface Props {
  onSuccess: () => void;
  setToast: (msg: string | null) => void;
  processTransaction: (text: string) => Promise<any>;
}

export function TransactionForm({ onSuccess, setToast, processTransaction }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setLocalError('');
    setToast(null);

    try {
      await processTransaction(text);
      setText('');
      setToast("✅ Transaksi berhasil dicatat!");
      onSuccess();
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-800 flex items-center gap-2">
        <span className="text-2xl">✨</span> Input Cerdas
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="glass-input p-4 h-32 text-lg resize-none"
          placeholder="Ketik transaksimu di sini... (contoh: gajian masuk 5 juta rupiah)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        {localError && <div className="text-red-700 bg-red-100/80 backdrop-blur-sm p-3 rounded-xl border border-red-200 font-medium text-sm">{localError}</div>}
        <button type="submit" className="glass-btn self-end md:w-auto w-full" disabled={loading}>
          {loading ? '🤖 Memproses dengan AI...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
}
