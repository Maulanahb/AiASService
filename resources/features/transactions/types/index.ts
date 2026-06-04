export interface Transaction {
  id: string;
  transaction_date: string;
  category: string;
  description: string;
  amount: number;
  type: string;
  raw_input: string;
}

export interface Summary {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo_bersih: number;
}
