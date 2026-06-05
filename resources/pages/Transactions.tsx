import { useState, useEffect } from 'react';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { TransactionList } from '../features/transactions/components/TransactionList';

export function Transactions() {
  const { transactions, isLoadingInitial, error, period, setPeriod, deleteTx } = useTransactions();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (isLoadingInitial) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-xl font-semibold tracking-wider animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-ai-teal border-t-transparent animate-spin"></div>
          Memuat Riwayat Transaksi...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[slideIn_0.3s_ease-out]">
      {toast && (
        <div className="fixed top-6 right-6 z-50 ai-glass-panel !bg-ai-surface/90 border-ai-teal/50 px-6 py-4 font-semibold text-ai-text-primary animate-[slideIn_0.3s_ease-out] shadow-[0_0_20px_rgba(0,245,196,0.2)] flex items-center gap-3">
          <span className="text-ai-teal">●</span> {toast}
        </div>
      )}

      {error && (
        <div className="ai-glass-panel !bg-red-900/20 !border-red-500/50 text-red-200 p-4 mb-8 flex items-center gap-3">
          <span className="text-red-400">⚠️</span> Gagal memuat riwayat: {error}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Riwayat Transaksi</h2>
          <p className="text-sm text-ai-text-muted">Pantau semua aktivitas pemasukan dan pengeluaran Anda.</p>
        </div>
        <div className="flex bg-white/50 border border-slate-200 rounded-xl p-1 backdrop-blur-md">
          {['all', 'harian', 'mingguan', 'bulanan'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                period === p
                  ? 'bg-white shadow-sm text-ai-primary'
                  : 'text-ai-text-muted hover:text-ai-text-primary hover:bg-white/50'
              }`}
            >
              {p === 'all' ? 'Semua' : p}
            </button>
          ))}
        </div>
      </header>

      <TransactionList transactions={transactions} onDelete={(id) => {
        deleteTx(id);
        setToast('Transaksi berhasil dihapus');
      }} />
    </div>
  );
}
