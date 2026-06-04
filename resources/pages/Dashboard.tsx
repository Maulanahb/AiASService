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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-700">
        <div className="text-3xl font-semibold tracking-wide animate-pulse">
          Memuat Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 font-sans selection:bg-purple-300 selection:text-purple-900">
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {toast && (
          <div className="fixed top-4 right-4 z-50 glass-card !bg-green-100/80 !border-green-300 px-6 py-4 font-semibold text-green-800 animate-[slideIn_0.3s_ease-out]">
            {toast}
          </div>
        )}

        {error && (
          <div className="glass-card !bg-red-100/80 !border-red-300 text-red-800 font-semibold p-4 mb-6">
            🚨 Gagal memuat data dari server: {error}
          </div>
        )}

        <header className="mb-12 text-center mt-4">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            AI Catatan Keuangan
          </h1>
          <p className="text-lg font-medium glass-card inline-block px-6 py-2 text-purple-700 !rounded-full !shadow-md">
            Catat pengeluaranmu cukup dengan mengetik kalimat biasa! ✨
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-t-4 !border-t-blue-400 cursor-default">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">Pemasukan Bulan Ini</h3>
            <p className="text-3xl font-bold text-gray-800">{formatRupiah(summary.total_pemasukan)}</p>
          </div>
          <div className="glass-card p-6 border-t-4 !border-t-pink-400 cursor-default">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-600 mb-2">Pengeluaran Bulan Ini</h3>
            <p className="text-3xl font-bold text-gray-800">{formatRupiah(summary.total_pengeluaran)}</p>
          </div>
          <div className="glass-card p-6 border-t-4 !border-t-purple-400 cursor-default">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-600 mb-2">Saldo Bersih</h3>
            <p className="text-3xl font-bold text-gray-800">{formatRupiah(summary.saldo_bersih)}</p>
          </div>
        </div>

        <TransactionForm onSuccess={refreshData} setToast={setToast} processTransaction={processTransaction} />
        
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
