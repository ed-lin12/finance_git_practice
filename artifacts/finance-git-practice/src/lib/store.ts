import { useState, useEffect } from 'react';

export type Expense = {
  id: string;
  description: string;
  category: string;
  date: string;
  amountCents: number;
  vendor?: string;
  note?: string;
  synthetic?: boolean;
};

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', description: 'Synthetic: Q3 Cloud Hosting', vendor: 'Northstar Cloud', category: 'Technology', date: '2023-09-15', amountCents: 450000, note: 'Infrastructure renewal · monthly', synthetic: true },
  { id: '2', description: 'Synthetic: Annual Legal Retainer', vendor: 'Ridge & Lane', category: 'Legal', date: '2023-10-01', amountCents: 1200000, note: 'Contract coverage · FY24', synthetic: true },
  { id: '3', description: 'Synthetic: Office Supplies', vendor: 'Paper District', category: 'Operations', date: '2023-10-15', amountCents: 35050, note: 'Studio replenishment', synthetic: true },
];

function readExpenses(): Expense[] {
  const stored = localStorage.getItem('finance_expenses');
  if (!stored) return INITIAL_EXPENSES;
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error('Saved expenses are not a list.');
  return parsed.filter((item): item is Expense => {
    if (!item || typeof item !== 'object') return false;
    const expense = item as Partial<Expense>;
    return typeof expense.id === 'string'
      && typeof expense.description === 'string'
      && typeof expense.category === 'string'
      && typeof expense.date === 'string'
      && Number.isSafeInteger(expense.amountCents)
      && (expense.amountCents ?? 0) > 0;
  }).map(expense => ({
    ...expense,
    vendor: expense.vendor?.trim() || expense.description.replace(/^Synthetic:\s*/i, ''),
    note: expense.note?.trim() || 'No memo supplied',
    synthetic: expense.synthetic ?? expense.description.startsWith('Synthetic:'),
  }));
}

export function useExpenses() {
  const [initial] = useState<{ expenses: Expense[]; error: string }>(() => {
    try {
      return { expenses: readExpenses(), error: '' };
    } catch {
      return {
        expenses: INITIAL_EXPENSES,
        error: 'Saved expense data could not be read. The original training records are shown instead.',
      };
    }
  });
  const [storageError, setStorageError] = useState(initial.error);
  const [expenses, setExpenses] = useState<Expense[]>(initial.expenses);

  useEffect(() => {
    try {
      localStorage.setItem('finance_expenses', JSON.stringify(expenses));
      setStorageError('');
    } catch {
      setStorageError('Changes could not be saved in this browser.');
    }
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

  return { expenses, addExpense, editExpense, deleteExpense, storageError };
}

export function useReviewedExpenses() {
  const [reviewed, setReviewed] = useState<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('finance_expenses_reviewed') ?? '[]');
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('finance_expenses_reviewed', JSON.stringify(reviewed));
  }, [reviewed]);

  const toggleReviewed = (id: string) => {
    setReviewed(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  };

  return { reviewed, toggleReviewed };
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