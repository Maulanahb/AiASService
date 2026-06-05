import { useState, FormEvent } from 'react';

interface SavingsModalProps {
  type: 'create' | 'addFund';
  onClose: () => void;
  onSubmit: (data: { title?: string; target_amount?: number; amount?: number }) => Promise<void>;
}

export function SavingsModal({ type, onClose, onSubmit }: SavingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'create') {
        await onSubmit({ title, target_amount: Number(amount) });
      } else {
        await onSubmit({ amount: Number(amount) });
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memproses data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl animate-[slideIn_0.2s_ease-out]">
        
        <h2 className="text-2xl font-bold tracking-tight text-ai-text-primary mb-6">
          {type === 'create' ? 'Buat Target Tabungan' : 'Tambah Dana'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'create' && (
            <div>
              <label className="block text-xs font-semibold text-ai-text-muted uppercase tracking-widest mb-2">Nama Target</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-ai-text-primary focus:border-ai-primary focus:ring-1 focus:ring-ai-primary outline-none transition-all"
                  placeholder="Misal: Dana Darurat, Beli MacBook..."
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-ai-text-muted uppercase tracking-widest mb-2">
              {type === 'create' ? 'Nominal Target (Rp)' : 'Nominal Ditambahkan (Rp)'}
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ai-text-muted font-semibold">Rp</span>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required min="1000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-ai-text-primary focus:border-ai-primary focus:ring-1 focus:ring-ai-primary outline-none transition-all tabular-nums"
                placeholder={type === 'create' ? '25000000' : '50000'}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-ai-text-primary font-bold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-ai-primary hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 hover:-translate-y-0.5"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
