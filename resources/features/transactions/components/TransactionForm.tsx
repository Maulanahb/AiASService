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
    <div className="brutal-card p-6 bg-pink-300">
      <h2 className="text-2xl font-bold mb-4 uppercase">📝 Input Cerdas</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="brutal-border p-4 h-32 text-lg resize-none focus:outline-none focus:ring-4 focus:ring-black"
          placeholder="Ketik transaksimu di sini... (contoh: gajian masuk 5 juta rupiah)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        {localError && <div className="text-red-900 bg-red-100 p-3 brutal-border font-medium text-sm animate-pulse">{localError}</div>}
        <button type="submit" className="brutal-btn" disabled={loading}>
          {loading ? '🤖 Memproses dengan AI...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
}
