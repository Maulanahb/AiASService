export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
}
