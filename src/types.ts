export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  category: 'Needs' | 'Wants' | 'Savings' | 'Debt';
  description: string;
  icon: string;
}

export interface BudgetRecommendation {
  totalSalary: number;
  categories: BudgetCategory[];
  advice: string;
  savingsGoal: string;
  lifestyleTips: string[];
}

export type ThinkingState = 'idle' | 'analyzing' | 'calculating' | 'optimizing' | 'completed';
