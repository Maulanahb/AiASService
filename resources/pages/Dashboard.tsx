import { useState, useEffect } from 'react';
import { TransactionForm } from '../features/transactions/components/TransactionForm';
import { TransactionList } from '../features/transactions/components/TransactionList';
import { useTransactions } from '../features/transactions/hooks/useTransactions';

export function Dashboard() {
  const { transactions, summary, isLoadingInitial, error, refreshData, processTransaction, period, setPeriod, deleteTx } = useTransactions();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  if (isLoadingInitial) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-xl font-semibold tracking-wider animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-ai-teal border-t-transparent animate-spin"></div>
          Memuat Data...
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
          <span className="text-red-400">⚠️</span> Gagal memuat data: {error}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Overview</h2>
          <p className="text-sm text-ai-text-muted">Pantau dan kelola arus kas Anda dengan bantuan AI.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="md:col-span-2 bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-10 hover:scale-[0.99] transition-transform duration-500 relative overflow-hidden group shadow-lg">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-ai-primary/10 blur-[80px] rounded-full group-hover:bg-ai-primary/20 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-ai-secondary/10 blur-[80px] rounded-full group-hover:bg-ai-secondary/20 transition-colors duration-700"></div>
          
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ai-text-muted mb-3 relative z-10">Total Saldo Bersih</h3>
          <p className="text-5xl md:text-6xl font-bold text-ai-text-primary tracking-tight tabular-nums mb-6 relative z-10">
            {formatRupiah(summary.saldo_bersih)}
          </p>
          
          <div className="flex items-center gap-2 text-xs font-medium text-ai-primary bg-ai-primary/10 w-fit px-3 py-1.5 rounded-full border border-ai-primary/20 relative z-10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ai-primary"></span>
            </span>
            Kondisi Kas Stabil
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:scale-[0.98] transition-transform duration-500 group relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ai-text-muted mb-3 flex items-center justify-between relative z-10">
              Pemasukan
              <span className="text-emerald-600 bg-emerald-500/10 p-1 rounded">↗</span>
            </h3>
            <p className="text-2xl md:text-3xl font-semibold text-emerald-600 tracking-tight tabular-nums relative z-10">{formatRupiah(summary.total_pemasukan)}</p>
          </div>
          <div className="flex-1 bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:scale-[0.98] transition-transform duration-500 group relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full group-hover:bg-rose-500/10 transition-colors duration-500"></div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ai-text-muted mb-3 flex items-center justify-between relative z-10">
              Pengeluaran
              <span className="text-rose-600 bg-rose-500/10 p-1 rounded">↘</span>
            </h3>
            <p className="text-2xl md:text-3xl font-semibold text-rose-600 tracking-tight tabular-nums relative z-10">{formatRupiah(summary.total_pengeluaran)}</p>
          </div>
        </div>
      </div>

      <TransactionForm onSuccess={refreshData} setToast={setToast} processTransaction={processTransaction} />
      
      <TransactionList transactions={transactions} onDelete={deleteTx} />
    </div>
  );
}
