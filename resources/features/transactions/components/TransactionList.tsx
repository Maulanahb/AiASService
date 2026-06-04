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
    <div className="brutal-card bg-emerald-200 mt-8 overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b-4 border-black bg-emerald-300 shrink-0 flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-tight">📊 Riwayat Transaksi</h2>
        <span className="font-bold bg-white brutal-border px-3 py-1 text-sm">{transactions.length} Data</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 relative custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 shadow-[0_4px_0_rgba(0,0,0,1)]">
            <tr className="bg-emerald-100 uppercase text-sm font-bold">
              <th className="p-4 border-r-4 border-black border-b-4">Tanggal</th>
              <th className="p-4 border-r-4 border-black border-b-4">Kategori</th>
              <th className="p-4 border-r-4 border-black border-b-4">Deskripsi</th>
              <th className="p-4 border-r-4 border-black border-b-4">Nominal</th>
              <th className="p-4 border-b-4 border-black">Jenis</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center font-bold text-lg bg-white opacity-70">
                  Belum ada transaksi bulan ini.
                </td>
              </tr>
            ) : (
              transactions.map((t, index) => (
                <tr key={t.id} className={`hover:bg-yellow-100 transition-colors ${index !== transactions.length - 1 ? "border-b-4 border-black bg-white" : "bg-white"}`}>
                  <td className="p-4 border-r-4 border-black font-medium">{t.transaction_date}</td>
                  <td className="p-4 border-r-4 border-black">
                    <span className="bg-yellow-200 px-2 py-1 brutal-border text-xs font-bold uppercase">{t.category}</span>
                  </td>
                  <td className="p-4 border-r-4 border-black">{t.description}</td>
                  <td className="p-4 border-r-4 border-black font-black text-xl tracking-tight">{formatRupiah(t.amount)}</td>
                  <td className="p-4 font-bold uppercase">
                    <span className={t.type === 'pemasukan' ? 'text-emerald-700 bg-emerald-100 px-2 py-1 brutal-border' : 'text-red-700 bg-red-100 px-2 py-1 brutal-border'}>
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
