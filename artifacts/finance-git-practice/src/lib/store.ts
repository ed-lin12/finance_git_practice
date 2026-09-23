import { useState, useEffect } from 'react';

export type Expense = {
  id: string;
  description: string;
  category: string;
  date: string;
  amountCents: number;
};

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', description: 'Synthetic: Q3 Cloud Hosting', category: 'Technology', date: '2023-09-15', amountCents: 450000 },
  { id: '2', description: 'Synthetic: Annual Legal Retainer', category: 'Legal', date: '2023-10-01', amountCents: 1200000 },
  { id: '3', description: 'Synthetic: Office Supplies', category: 'Operations', date: '2023-10-15', amountCents: 35050 },
];

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem('finance_expenses');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse expenses from localStorage");
    }
    return INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp = { ...exp, id: Math.random().toString(36).substring(2, 9) };
    setExpenses(prev => [newExp, ...prev]);
  };

  const editExpense = (id: string, updated: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...updated, id } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return { expenses, addExpense, editExpense, deleteExpense };
}

export type LessonProgress = Record<string, boolean>;

export function useProgress() {
  const [progress, setProgress] = useState<LessonProgress>(() => {
    try {
      const stored = localStorage.getItem('finance_git_progress');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse progress from localStorage");
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('finance_git_progress', JSON.stringify(progress));
  }, [progress]);

  const toggleLesson = (id: string, completed: boolean) => {
    setProgress(prev => ({ ...prev, [id]: completed }));
  };

  return { progress, toggleLesson };
}