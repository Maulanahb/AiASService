import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: Props) {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  return (
    <div className="glass-card mt-8 overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-white/30 bg-white/40 shrink-0 flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-purple-900">📊 Riwayat Transaksi</h2>
        <span className="font-semibold bg-white/50 text-purple-800 rounded-full px-4 py-1 text-sm shadow-sm border border-white/50">
          {transactions.length} Data
        </span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 relative custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="bg-white/60 backdrop-blur-md text-sm font-semibold text-gray-700">
              <th className="p-4 border-b border-white/40">Tanggal</th>
              <th className="p-4 border-b border-white/40">Kategori</th>
              <th className="p-4 border-b border-white/40">Deskripsi</th>
              <th className="p-4 border-b border-white/40">Nominal</th>
              <th className="p-4 border-b border-white/40">Jenis</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center font-medium text-lg text-gray-500 bg-white/10">
                  Belum ada transaksi bulan ini.
                </td>
              </tr>
            ) : (
              transactions.map((t, index) => (
                <tr key={t.id} className={`hover:bg-white/40 transition-colors ${index !== transactions.length - 1 ? "border-b border-white/20 bg-white/20" : "bg-white/20"}`}>
                  <td className="p-4 font-medium text-gray-700">{t.transaction_date}</td>
                  <td className="p-4">
                    <span className="bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-200/50">{t.category}</span>
                  </td>
                  <td className="p-4 text-gray-800">{t.description}</td>
                  <td className="p-4 font-bold text-lg text-gray-900 tracking-tight">{formatRupiah(t.amount)}</td>
                  <td className="p-4 font-semibold">
                    <span className={t.type === 'pemasukan' ? 'text-green-700 bg-green-100/80 px-3 py-1 rounded-full shadow-sm border border-green-200/50' : 'text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full shadow-sm border border-rose-200/50'}>
                      {t.type}
                    </span>
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
