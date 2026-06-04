import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface Transaction {
  id: string; // Changed to string for UUID
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

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_pemasukan: 0, total_pengeluaran: 0, saldo_bersih: 0 });
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiService.getHistory();
      setTransactions(data.transactions);
      setSummary(data.summary);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactions,
    summary,
    isLoadingInitial,
    error,
    refreshData: fetchData
  };
}
