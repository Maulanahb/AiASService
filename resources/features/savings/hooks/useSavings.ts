import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../core/api/apiClient';
import { SavingsGoal } from '../types';

export function useSavings() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('savings');
      // The API returns the array in data directly (data.data is handled in apiClient.get)
      setGoals(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGoal = async (title: string, target_amount: number, deadline?: string) => {
    await apiClient.post('savings_create', { title, target_amount, deadline });
    await fetchGoals();
  };

  const addFund = async (id: string, amount: number) => {
    await apiClient.post('savings_add_fund', { id, amount });
    await fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    await apiClient.delete(`savings_delete&id=${id}`);
    await fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    isLoading,
    error,
    createGoal,
    addFund,
    deleteGoal,
    refreshGoals: fetchGoals
  };
}
