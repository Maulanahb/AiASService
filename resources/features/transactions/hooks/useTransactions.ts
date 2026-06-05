import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../core/api/apiClient';
import { Transaction, Summary } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_pemasukan: 0, total_pengeluaran: 0, saldo_bersih: 0 });
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('all');

  const fetchData = useCallback(async () => {
    try {
      const data = await apiClient.get(`history&period=${period}`);
      setTransactions(data.transactions);
      setSummary(data.summary);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [period]);

  const processTransaction = async (text: string) => {
    return apiClient.post('process', { text });
  };

  const deleteTx = async (id: string) => {
    await apiClient.delete(`delete&id=${id}`);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactions,
    summary,
    isLoadingInitial,
    error,
    period,
    setPeriod,
    refreshData: fetchData,
    processTransaction,
    deleteTx
  };
}
