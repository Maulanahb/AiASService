import { useState, useEffect, useCallback } from 'react';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  actual: number;
  month: string;
}

export function useBudgets(month: string) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api.php?action=budgets&month=${month}`);
      const data = await response.json();
      
      if (response.ok) {
        setBudgets(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Gagal mengambil data anggaran');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const saveBudget = async (category: string, amount: number) => {
    try {
      const response = await fetch('/api.php?action=budget_save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, month })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchBudgets();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Kesalahan jaringan' };
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api.php?action=budget_delete&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchBudgets();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return { budgets, isLoading, error, saveBudget, deleteBudget, refreshBudgets: fetchBudgets };
}
