import type { Expense } from './store';

export type PolicyCheck = {
  label: string;
  passed: boolean;
  detail: string;
};

export function checkExpensePolicy(expense: Expense): PolicyCheck[] {
  return [
    {
      label: 'Positive amount',
      passed: Number.isSafeInteger(expense.amountCents) && expense.amountCents > 0,
      detail: 'Training records must use a positive amount stored in integer cents.',
    },
    {
      label: 'Memo present',
      passed: Boolean(expense.note && expense.note !== 'No memo supplied'),
      detail: 'A short business-purpose memo is expected.',
    },
    {
      label: 'Extra approval threshold',
      passed: expense.amountCents < 500_000,
      detail: 'Synthetic training rule: expenses of $5,000 or more need an extra approval.',
    },
  ];
}

export function parseAmountToCents(value: string): number | null {
  const normalized = value.trim().replace(/[$,\s]/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}