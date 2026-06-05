import { useTransactions } from '../features/transactions/hooks/useTransactions';

export function Reports() {
  const { summary, transactions, isLoadingInitial, period, setPeriod } = useTransactions();

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
          <div className="w-5 h-5 rounded-full border-2 border-ai-purple border-t-transparent animate-spin"></div>
          Menyiapkan Statistik...
        </div>
      </div>
    );
  }

  const total = Number(summary.total_pemasukan) + Number(summary.total_pengeluaran);
  const incomePercent = total === 0 ? 0 : Math.round((Number(summary.total_pemasukan) / total) * 100);
  const expensePercent = total === 0 ? 0 : 100 - incomePercent;

  // Aggregate by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  // Sort descending
  const sortedExpenses = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const sortedIncomes = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="animate-[slideIn_0.3s_ease-out]">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Statistik</h2>
          <p className="text-sm text-ai-text-muted">Analisis AI terhadap pola keuangan Anda.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 w-fit shadow-sm">
          {['harian', 'mingguan', 'bulanan', 'all'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-semibold tracking-wide uppercase transition-all ${
                period === p ? 'bg-slate-100 text-ai-primary shadow-sm' : 'text-ai-text-muted hover:text-ai-text-primary hover:bg-slate-50'
              }`}
            >
              {p === 'all' ? 'Semua' : p}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="ai-glass-panel p-8">
          <h3 className="text-sm font-semibold tracking-widest text-ai-text-muted uppercase mb-8">Rasio Keuangan</h3>
          
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-ai-teal font-mono uppercase tracking-widest mb-1">Pemasukan</p>
              <p className="text-2xl font-bold text-ai-text-primary">{incomePercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ai-purple font-mono uppercase tracking-widest mb-1">Pengeluaran</p>
              <p className="text-2xl font-bold text-ai-text-primary">{expensePercent}%</p>
            </div>
          </div>
          
          {/* Custom Progress Bar */}
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${incomePercent}%` }}
            ></div>
            <div 
              className="h-full bg-rose-500 transition-all duration-1000 ease-out"
              style={{ width: `${expensePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="ai-glass-panel p-8 flex flex-col justify-center">
          <h3 className="text-sm font-semibold tracking-widest text-ai-text-muted uppercase mb-6">AI Insight</h3>
          {summary.total_pengeluaran > summary.total_pemasukan ? (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <span className="text-rose-500">⚠️</span>
              </div>
              <div>
                <h4 className="text-ai-text-primary font-semibold mb-1">Peringatan Defisit</h4>
                <p className="text-sm text-ai-text-muted leading-relaxed">
                  Pengeluaran Anda melebihi pemasukan pada periode ini. Kurangi pengeluaran tersier untuk menyeimbangkan arus kas.
                </p>
              </div>
            </div>
          ) : (
             <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                <span className="text-emerald-500">✨</span>
              </div>
              <div>
                <h4 className="text-ai-text-primary font-semibold mb-1">Kondisi Ideal</h4>
                <p className="text-sm text-ai-text-muted leading-relaxed">
                  Arus kas Anda positif. Pertahankan pola ini dan alokasikan sisa saldo ({formatRupiah(summary.saldo_bersih)}) untuk tabungan atau investasi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="ai-glass-panel p-8">
          <h3 className="text-sm font-semibold tracking-widest text-ai-text-muted uppercase mb-6">Distribusi Pemasukan</h3>
          {sortedIncomes.length === 0 ? (
            <p className="text-sm text-ai-text-muted italic">Belum ada pemasukan di periode ini.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {sortedIncomes.map(([cat, val]) => {
                const pct = Math.round((val / summary.total_pemasukan) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ai-text-primary font-medium">{cat}</span>
                      <span className="text-emerald-600 font-mono tabular-nums">{formatRupiah(val)} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ai-glass-panel p-8">
          <h3 className="text-sm font-semibold tracking-widest text-ai-text-muted uppercase mb-6">Distribusi Pengeluaran</h3>
          {sortedExpenses.length === 0 ? (
            <p className="text-sm text-ai-text-muted italic">Belum ada pengeluaran di periode ini.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {sortedExpenses.map(([cat, val]) => {
                const pct = Math.round((val / summary.total_pengeluaran) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ai-text-primary font-medium">{cat}</span>
                      <span className="text-rose-600 font-mono tabular-nums">{formatRupiah(val)} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="ai-glass-panel p-8">
            <h3 className="text-sm font-semibold tracking-widest text-ai-text-muted uppercase mb-6">Ringkasan Nominal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-ai-text-muted uppercase tracking-widest mb-1">Total Pemasukan</p>
                <p className="text-xl font-bold text-emerald-600">{formatRupiah(summary.total_pemasukan)}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-ai-text-muted uppercase tracking-widest mb-1">Total Pengeluaran</p>
                <p className="text-xl font-bold text-rose-600">{formatRupiah(summary.total_pengeluaran)}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-ai-text-muted uppercase tracking-widest mb-1">Saldo Bersih</p>
                <p className={`text-xl font-bold ${summary.saldo_bersih >= 0 ? 'text-ai-text-primary' : 'text-rose-500'}`}>
                  {formatRupiah(summary.saldo_bersih)}
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
