import { useState } from 'react';
import { useSavings } from '../features/savings/hooks/useSavings';
import { SavingsModal } from '../features/savings/components/SavingsModal';

export function Savings() {
  const { goals, isLoading, createGoal, addFund, deleteGoal } = useSavings();
  const [modalType, setModalType] = useState<'create' | 'addFund' | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

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
        <div className="text-xl font-semibold tracking-wider animate-pulse flex items-center gap-3 text-ai-text-primary">
          <div className="w-5 h-5 rounded-full border-2 border-ai-teal border-t-transparent animate-spin"></div>
          Memuat Data Tabungan...
        </div>
      </div>
    );
  }

  const handleOpenAddFund = (id: string) => {
    setSelectedGoalId(id);
    setModalType('addFund');
  };

  const totalTarget = goals.reduce((acc, g) => acc + Number(g.target_amount), 0);
  const totalTerkumpul = goals.reduce((acc, g) => acc + Number(g.current_amount), 0);
  const totalCurrent = goals.reduce((acc, g) => acc + Number(g.current_amount), 0);
  const totalProgress = totalTarget === 0 ? 0 : (totalCurrent / totalTarget) * 100;

  return (
    <div className="animate-[slideIn_0.3s_ease-out]">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Tabungan & Goals</h2>
          <p className="text-sm text-ai-text-muted">Pantau progres wishlist dan target tabungan Anda.</p>
        </div>
        <button 
          onClick={() => setModalType('create')}
          className="ai-btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Target Baru
        </button>
      </header>

      {/* Global Savings Progress */}
      <div className="mb-8 bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-lg">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-ai-primary/10 blur-[80px] rounded-full"></div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-ai-text-muted mb-6 relative z-10">Total Dana Terkumpul</h3>
        <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
          <div>
            <p className="text-5xl font-bold text-ai-text-primary tracking-tight tabular-nums">
              {formatRupiah(totalCurrent)}
            </p>
            <p className="text-sm text-ai-text-muted mt-2">
              dari total target <span className="font-semibold text-ai-text-primary">{formatRupiah(totalTarget)}</span>
            </p>
          </div>
          <div className="flex-1 w-full max-w-md ml-auto">
            <div className="flex justify-between text-xs font-semibold text-ai-primary mb-2">
              <span>Progres Keseluruhan</span>
              <span>{totalProgress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
              <div 
                className="h-full bg-gradient-to-r from-ai-primary to-ai-secondary transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(totalProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">🎯</div>
          <h3 className="text-xl font-semibold text-ai-text-primary mb-2">Belum ada target tabungan</h3>
          <p className="text-ai-text-muted text-sm max-w-sm mx-auto mb-6">Mulai rencanakan masa depan Anda dengan menetapkan target tabungan pertama.</p>
          <button onClick={() => setModalType('create')} className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-ai-primary font-bold rounded-xl transition-colors shadow-sm">Buat Target Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const current = Number(goal.current_amount);
            const target = Number(goal.target_amount);
            const pct = Math.min(Math.round((current / target) * 100), 100);
            const isCompleted = current >= target;

            return (
              <div key={goal.id} className="bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-500 hover:shadow-lg group relative overflow-hidden flex flex-col">
                {isCompleted && (
                  <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors z-0"></div>
                )}
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <h3 className="text-lg font-bold text-ai-text-primary leading-tight line-clamp-2">{goal.title}</h3>
                  <button 
                    onClick={() => { if(confirm('Hapus target ini?')) deleteGoal(goal.id) }}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-ai-text-muted hover:text-rose-500 rounded-lg transition-all shrink-0"
                    title="Hapus Target"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="mb-6 relative z-10">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-2xl font-bold tabular-nums tracking-tight ${isCompleted ? 'text-emerald-600' : 'text-ai-text-primary'}`}>
                      {formatRupiah(current)}
                    </span>
                  </div>
                  <div className="text-sm text-ai-text-muted tabular-nums">
                    dari target <span className="font-semibold text-ai-text-primary">{formatRupiah(target)}</span>
                  </div>
                </div>

                <div className="mb-6 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-ai-text-muted">Progres</span>
                    <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-600' : 'text-ai-primary'}`}>{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-ai-primary to-ai-secondary'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <button 
                    onClick={() => handleOpenAddFund(goal.id)}
                    disabled={isCompleted}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isCompleted 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                      : 'bg-white border border-slate-200 text-ai-primary hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    {isCompleted ? 'Target Tercapai ✨' : '+ Tambah Dana'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalType === 'create' && (
        <SavingsModal 
          type="create" 
          onClose={() => setModalType(null)} 
          onSubmit={async (data) => {
            await createGoal(data.title!, data.target_amount!);
            setModalType(null);
          }} 
        />
      )}

      {modalType === 'addFund' && selectedGoalId && (
        <SavingsModal 
          type="addFund" 
          onClose={() => setModalType(null)} 
          onSubmit={async (data) => {
            await addFund(selectedGoalId, data.amount!);
            setModalType(null);
          }} 
        />
      )}
    </div>
  );
}
