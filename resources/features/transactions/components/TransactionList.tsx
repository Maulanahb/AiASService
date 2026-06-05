import { useState } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: Props) {
  const [filterType, setFilterType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  const getCategoryColor = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('makan') || c.includes('food')) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    if (c.includes('gaji') || c.includes('income')) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (c.includes('transport')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    return 'text-ai-purple border-ai-purple/30 bg-ai-purple/10';
  };

  return (
    <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-lg mt-8">
      <div className="p-6 border-b border-slate-200 bg-slate-50 shrink-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-xl font-bold tracking-tight text-ai-text-primary">Riwayat Transaksi</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-ai-text-primary focus:border-ai-primary focus:ring-1 focus:ring-ai-primary outline-none transition-all shadow-sm"
            />
            <svg className="w-4 h-4 text-ai-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto justify-center">
            {(['all', 'pemasukan', 'pengeluaran'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold tracking-wide uppercase transition-all ${
                  filterType === f ? 'bg-slate-100 text-ai-primary shadow-sm' : 'text-ai-text-muted hover:text-ai-text-primary hover:bg-slate-50'
                }`}
              >
                {f === 'all' ? 'Semua' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-100 backdrop-blur-xl text-[10px] uppercase tracking-widest font-semibold text-ai-text-muted">
              <th className="p-4 pl-6 font-semibold">TANGGAL</th>
              <th className="p-4 font-semibold">KATEGORI</th>
              <th className="p-4 font-semibold">DESKRIPSI</th>
              <th className="p-4 text-right font-semibold">NOMINAL</th>
              <th className="p-4 text-right pr-6 font-semibold">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-ai-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ai-text-primary">Belum ada transaksi</p>
                      <p className="text-xs text-ai-text-muted mt-1">Gunakan form di atas untuk mencatat.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="bg-transparent hover:bg-slate-50 transition-colors duration-300 group cursor-default">
                  <td className="p-4 pl-6 text-sm text-ai-text-muted font-mono tracking-tighter">{t.transaction_date}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border backdrop-blur-sm ${getCategoryColor(t.category)}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-ai-text-primary font-medium">{t.description}</td>
                  <td className="p-4 text-sm font-semibold text-ai-text-primary text-right tabular-nums tracking-tight">{formatRupiah(t.amount)}</td>
                  <td className="p-4 text-right pr-6">
                    {onDelete && (
                      <button 
                        onClick={() => {
                          if(confirm('Hapus transaksi ini secara permanen?')) onDelete(t.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-100 text-ai-text-muted hover:text-rose-500 transition-all duration-300 transform hover:scale-110"
                        title="Hapus Transaksi"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
