import { useState, useEffect } from 'react';
import { TransactionForm } from '../features/transactions/components/TransactionForm';
import { TransactionList } from '../features/transactions/components/TransactionList';
import { useTransactions } from '../features/transactions/hooks/useTransactions';

export function Dashboard() {
  const { transactions, summary, isLoadingInitial, error, refreshData, processTransaction } = useTransactions();
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
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 text-gray-900 font-['Space_Grotesk']">
        <div className="text-3xl font-black uppercase tracking-tight animate-bounce drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          Memuat Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 brutal-card bg-green-300 px-6 py-4 font-bold animate-[slideIn_0.3s_ease-out]">
          {toast}
        </div>
      )}

      {error && (
        <div className="brutal-card bg-red-400 text-black font-bold p-4 mb-6">
          🚨 Gagal memuat data dari server: {error}
        </div>
      )}

      <header className="mb-12 text-center mt-4">
        <h1 className="text-5xl font-black uppercase mb-4 tracking-tight drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          AI Catatan Keuangan
        </h1>
        <p className="text-xl font-medium brutal-border bg-yellow-200 inline-block px-4 py-2 hover:bg-yellow-300 transition-colors cursor-default">
          Catat pengeluaranmu cukup dengan mengetik kalimat biasa!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="brutal-card bg-cyan-300 p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] cursor-pointer">
          <h3 className="font-bold uppercase mb-2">Pemasukan Bulan Ini</h3>
          <p className="text-3xl font-black">{formatRupiah(summary.total_pemasukan)}</p>
        </div>
        <div className="brutal-card bg-rose-300 p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] cursor-pointer">
          <h3 className="font-bold uppercase mb-2">Pengeluaran Bulan Ini</h3>
          <p className="text-3xl font-black">{formatRupiah(summary.total_pengeluaran)}</p>
        </div>
        <div className="brutal-card bg-violet-300 p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] cursor-pointer">
          <h3 className="font-bold uppercase mb-2">Saldo Bersih</h3>
          <p className="text-3xl font-black">{formatRupiah(summary.saldo_bersih)}</p>
        </div>
      </div>

      <TransactionForm onSuccess={refreshData} setToast={setToast} processTransaction={processTransaction} />
      
      <TransactionList transactions={transactions} />
    </div>
  );
}
