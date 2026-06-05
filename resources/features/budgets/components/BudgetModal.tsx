import { useState } from 'react';

interface BudgetModalProps {
  onClose: () => void;
  onSubmit: (category: string, amount: number) => Promise<void>;
  initialCategory?: string;
  initialAmount?: number;
}

const CATEGORIES = [
  'Makanan & Minuman', 'Transportasi', 'Hiburan', 'Tagihan & Utilitas', 'Belanja', 'Kesehatan', 'Lainnya'
];

export function BudgetModal({ onClose, onSubmit, initialCategory = CATEGORIES[0], initialAmount = 0 }: BudgetModalProps) {
  const [category, setCategory] = useState(initialCategory);
  const [amount, setAmount] = useState<string>(initialAmount ? initialAmount.toString() : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(category, Number(amount));
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-[slideIn_0.3s_ease-out]">
        <h3 className="text-2xl font-bold text-ai-text-primary mb-6">Atur Anggaran Kategori</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ai-text-primary mb-2">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-ai-text-primary focus:outline-none focus:ring-2 focus:ring-ai-primary/20 focus:border-ai-primary transition-all font-medium appearance-none"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ai-text-primary mb-2">Target Anggaran (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 1500000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-ai-text-primary focus:outline-none focus:ring-2 focus:ring-ai-primary/20 focus:border-ai-primary transition-all font-medium"
              min="1"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || Number(amount) <= 0}
              className="flex-1 px-4 py-3 bg-ai-primary hover:bg-ai-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
