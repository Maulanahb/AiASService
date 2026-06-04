import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../core/api/apiClient';
import { Transaction, Summary } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_pemasukan: 0, total_pengeluaran: 0, saldo_bersih: 0 });
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiClient.get('history');
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

  const processTransaction = async (text: string) => {
    return apiClient.post('process', { text });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactions,
    summary,
    isLoadingInitial,
    error,
    refreshData: fetchData,
    processTransaction
  };
}
