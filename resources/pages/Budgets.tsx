import { useState } from 'react';
import { useBudgets } from '../features/budgets/hooks/useBudgets';
import { BudgetModal } from '../features/budgets/components/BudgetModal';

export function Budgets() {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { budgets, isLoading, error, saveBudget, deleteBudget } = useBudgets(currentMonth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<{ category: string; amount: number } | null>(null);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-xl font-semibold tracking-wider animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-ai-teal border-t-transparent animate-spin"></div>
          Memuat Data Anggaran...
        </div>
      </div>
    );
  }

  const handleOpenEdit = (category: string, amount: number) => {
    setEditingBudget({ category, amount });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-[slideIn_0.3s_ease-out]">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Anggaran Bulanan</h2>
          <p className="text-sm text-ai-text-muted">Kendalikan pengeluaran Anda dengan target per kategori.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="ai-btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Atur Anggaran
        </button>
      </header>

      {error && (
        <div className="ai-glass-panel !bg-red-900/20 !border-red-500/50 text-red-200 p-4 mb-8 flex items-center gap-3">
          <span className="text-red-400">⚠️</span> {error}
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-xl font-semibold text-ai-text-primary mb-2">Belum ada anggaran</h3>
          <p className="text-ai-text-muted text-sm max-w-sm mx-auto mb-6">Mulai rencanakan keuangan bulan ini agar lebih terstruktur.</p>
          <button onClick={handleOpenCreate} className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-ai-primary font-bold rounded-xl transition-colors shadow-sm">Buat Anggaran</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const pct = budget.amount > 0 ? Math.min(Math.round((budget.actual / budget.amount) * 100), 100) : 0;
            const isOverBudget = budget.actual >= budget.amount;
            const remaining = budget.amount - budget.actual;

            return (
              <div key={budget.id} className="bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-500 hover:shadow-lg group relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-bold text-ai-text-primary">{budget.category}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(budget.category, budget.amount)}
                      className="text-ai-text-muted hover:text-ai-primary p-1"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => { if(confirm('Hapus anggaran ini?')) deleteBudget(budget.id) }}
                      className="text-ai-text-muted hover:text-rose-500 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-ai-text-muted mb-1">Terpakai</p>
                  <p className={`text-2xl font-bold ${isOverBudget ? 'text-rose-600' : 'text-ai-text-primary'}`}>
                    {formatRupiah(budget.actual)}
                  </p>
                  <p className="text-xs text-ai-text-muted mt-1">
                    dari batas <span className="font-semibold">{formatRupiah(budget.amount)}</span>
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className={isOverBudget ? 'text-rose-600' : 'text-ai-text-muted'}>
                      {isOverBudget ? 'Anggaran Habis!' : `Sisa ${formatRupiah(Math.max(0, remaining))}`}
                    </span>
                    <span className={isOverBudget ? 'text-rose-600' : 'text-ai-primary'}>{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isOverBudget ? 'bg-rose-500' : 'bg-ai-primary'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <BudgetModal
          initialCategory={editingBudget?.category}
          initialAmount={editingBudget?.amount}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (category, amount) => {
            await saveBudget(category, amount);
          }}
        />
      )}
    </div>
  );
}
