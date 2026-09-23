import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, ArrowUpRight, Check, ChevronRight, Edit2, FilePlus2,
  MoreHorizontal, Search, ShieldCheck, Trash2,
} from 'lucide-react'
import { useExpenses, useReviewedExpenses, type Expense } from '@/lib/store'
import { checkExpensePolicy, parseAmountToCents } from '@/lib/expense-policy'
import { formatCents } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const CATEGORY_STYLES: Record<string, { dot: string; tint: string; ink: string }> = {
  Technology: { dot: 'bg-[#ff754b]', tint: 'bg-[#fff0e8]', ink: 'text-[#a43d20]' },
  Legal: { dot: 'bg-[#745fe8]', tint: 'bg-[#f0edff]', ink: 'text-[#4b38a4]' },
  Operations: { dot: 'bg-[#1b9c8d]', tint: 'bg-[#e5f6f1]', ink: 'text-[#157467]' },
  Marketing: { dot: 'bg-[#d87935]', tint: 'bg-[#fff1df]', ink: 'text-[#9a5526]' },
  Travel: { dot: 'bg-[#4684c6]', tint: 'bg-[#eaf3fb]', ink: 'text-[#2d659b]' },
}
const FALLBACK_STYLE = { dot: 'bg-[#938a7f]', tint: 'bg-[#f0ece4]', ink: 'text-[#665f57]' }
const EDIT_CATEGORIES = ['Technology', 'Legal', 'Operations', 'Marketing', 'Travel']

type FormState = {
  description: string
  vendor: string
  category: string
  date: string
  amount: string
  note: string
}

const blankForm = (): FormState => ({
  description: '',
  vendor: '',
  category: 'Technology',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  note: '',
})

function displayTitle(expense: Expense) {
  return expense.description.replace(/^Synthetic:\s*/i, '')
}

function displayDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.valueOf())
    ? date
    : new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed)
}

export default function ExpensesPage() {
  const { expenses, addExpense, editExpense, deleteExpense, storageError } = useExpenses()
  const { reviewed, toggleReviewed } = useReviewedExpenses()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(expenses[0]?.id ?? null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [form, setForm] = useState<FormState>(blankForm)
  const [formError, setFormError] = useState('')
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const categories = useMemo(() => ['All', ...Array.from(new Set([...EDIT_CATEGORIES, ...expenses.map(item => item.category)]))], [expenses])
  const filtered = useMemo(() => expenses.filter(expense => {
    const haystack = `${expense.description} ${expense.vendor ?? ''} ${expense.note ?? ''}`.toLowerCase()
    return (category === 'All' || expense.category === category) && haystack.includes(query.trim().toLowerCase())
  }), [category, expenses, query])
  const selected = filtered.find(expense => expense.id === selectedId) ?? filtered[0] ?? null

  useEffect(() => {
    if (selectedId && !expenses.some(expense => expense.id === selectedId)) {
      setSelectedId(expenses[0]?.id ?? null)
    }
  }, [expenses, selectedId])

  const openAdd = () => {
    setEditing(null)
    setForm(blankForm())
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (expense: Expense) => {
    setEditing(expense)
    setForm({
      description: displayTitle(expense),
      vendor: expense.vendor ?? '',
      category: expense.category,
      date: expense.date,
      amount: (expense.amountCents / 100).toFixed(2),
      note: expense.note === 'No memo supplied' ? '' : expense.note ?? '',
    })
    setFormError('')
    setFormOpen(true)
  }

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault()
    const amountCents = parseAmountToCents(form.amount)
    if (!form.description.trim() || !form.vendor.trim() || !form.date || !form.note.trim()) {
      setFormError('Description, merchant, date, and memo are required.')
      return
    }
    if (!amountCents) {
      setFormError('Enter a positive amount with no more than two decimal places.')
      return
    }
    const payload = {
      description: form.description.trim(),
      vendor: form.vendor.trim(),
      category: form.category,
      date: form.date,
      amountCents,
      note: form.note.trim(),
      synthetic: editing?.synthetic ?? false,
    }
    if (editing) {
      editExpense(editing.id, payload)
    } else {
      addExpense(payload)
    }
    setFormOpen(false)
  }

  const goNext = () => {
    if (!selected || filtered.length === 0) return
    const index = filtered.findIndex(expense => expense.id === selected.id)
    const next = filtered[(index + 1) % filtered.length]
    setSelectedId(next.id)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteExpense(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-[#fcfaf6]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e0d5] px-5 py-5 lg:px-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a16642]">Practice close · {expenses.length} items on the desk</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight lg:text-3xl">Your review desk</h1>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#f6c85d] px-4 py-3 text-sm font-extrabold text-[#25313a] shadow-[0_5px_0_#d7a837] transition hover:translate-y-px hover:shadow-[0_4px_0_#d7a837] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e8c878]">
          <FilePlus2 size={17} /> Capture expense
        </button>
      </header>

      <div className="border-b border-[#e8e0d5] bg-[#fff8e9] px-5 py-3 text-xs leading-relaxed text-[#6c573d] lg:px-8">
        <div className="flex gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#d87935]" /><p><strong>Synthetic training desk.</strong> Records and review changes stay in this browser. They do not edit repository files, create commits, or connect to Git. Use the <a href="./guide" className="font-bold underline underline-offset-2">Git practice guide</a> for real file-editing steps.</p></div>
      </div>
      {storageError && <div role="alert" className="border-b border-[#e8b4a8] bg-[#fff0ed] px-8 py-3 text-sm text-[#8d3524]">{storageError}</div>}

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(340px,0.95fr)_minmax(380px,1.05fr)]">
        <div className="border-b border-[#e8e0d5] p-5 lg:border-b-0 lg:border-r lg:p-8">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-4 top-3.5 text-[#91897f]" />
            <input aria-label="Search expense records" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a merchant or expense" className="w-full rounded-xl border border-[#ded6ca] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa198] focus:border-[#d87935] focus:ring-4 focus:ring-[#f9dfb7]" />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Spend lanes">
            {categories.map(item => {
              const count = item === 'All' ? expenses.length : expenses.filter(expense => expense.category === item).length
              const style = CATEGORY_STYLES[item] ?? FALLBACK_STYLE
              return <button key={item} onClick={() => setCategory(item)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${category === item ? 'border-[#1f3040] bg-[#1f3040] text-white' : 'border-[#ded6ca] bg-white text-[#665f57] hover:border-[#c7b8a4]'}`}><span className={`h-2 w-2 rounded-full ${item === 'All' ? 'bg-[#f7c85b]' : style.dot}`} />{item}<span className="opacity-70">{count}</span></button>
            })}
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div><p className="text-sm font-bold">In the queue</p><p className="mt-1 text-xs text-[#837b71]">Select one to inspect its trail.</p></div>
            <p className="text-xs font-bold text-[#837b71]">{filtered.length} records</p>
          </div>
          <div className="mt-5 space-y-3">
            {filtered.map(expense => {
              const style = CATEGORY_STYLES[expense.category] ?? FALLBACK_STYLE
              const active = expense.id === selected?.id
              return (
                <button key={expense.id} onClick={() => setSelectedId(expense.id)} className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f9dfb7] ${active ? 'border-[#d87935] bg-[#fff6e7] shadow-[0_8px_18px_rgba(177,107,49,0.09)]' : 'border-[#e8e0d5] bg-white hover:border-[#d7c2aa]'}`}>
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${style.tint} ${style.ink}`}><span className="text-sm font-black">{(expense.vendor ?? displayTitle(expense)).slice(0, 1).toUpperCase()}</span></div>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-extrabold">{displayTitle(expense)}</p>{reviewed.includes(expense.id) && <Check size={14} className="shrink-0 text-[#1b9c8d]" />}</div><p className="mt-1 truncate text-xs text-[#847b70]">{expense.vendor} · {displayDate(expense.date).replace(/, \d{4}$/, '')}</p></div>
                  <div className="text-right"><p className="text-sm font-black">{formatCents(expense.amountCents)}</p><span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${style.tint} ${style.ink}`}>{expense.category}</span></div>
                </button>
              )
            })}
            {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#d8cfc2] p-9 text-center text-sm text-[#82796e]">{expenses.length === 0 ? 'The desk is empty. Capture an expense to begin.' : 'Nothing in this lane matches that search.'}</div>}
          </div>
        </div>

        <article className="relative overflow-hidden bg-[#fdfbf7] p-5 lg:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#f9e2b4] opacity-55 blur-3xl" />
          {!selected ? (
            <div className="relative grid min-h-72 place-items-center rounded-[22px] border border-dashed border-[#d8cfc2] p-8 text-center"><div><p className="font-black">No record selected</p><p className="mt-2 text-sm text-[#716a62]">Adjust your filters or capture a new expense.</p></div></div>
          ) : (
            <>
              <div className="relative flex items-start justify-between gap-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a16642]">Record detail</p><h2 className="mt-2 text-2xl font-black tracking-tight">{displayTitle(selected)}</h2>{selected.synthetic && <span className="mt-2 inline-block rounded-full bg-[#fff0e8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a43d20]">Synthetic record</span>}</div>
                <div className="flex gap-2">
                  <button aria-label="Edit selected expense" onClick={() => openEdit(selected)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#ded6ca] bg-white text-[#766d63] hover:bg-[#f5f1e8]"><Edit2 size={16} /></button>
                  <button aria-label="Delete selected expense" onClick={() => setDeleteTarget(selected)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#ded6ca] bg-white text-[#9c4a3a] hover:bg-[#fff0ed]"><Trash2 size={16} /></button>
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#ded6ca] bg-white text-[#766d63]" aria-hidden="true"><MoreHorizontal size={18} /></span>
                </div>
              </div>
              <div className="relative mt-8 rounded-[22px] bg-[#1f3040] p-6 text-white shadow-[0_15px_32px_rgba(31,48,64,0.22)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9c3ca]">Outflow</p>
                <p className="mt-2 text-4xl font-black tracking-tight">{formatCents(selected.amountCents)}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-[#cbd3d7]"><span>Recorded {displayDate(selected.date)}</span><button onClick={() => setReceiptOpen(true)} className="inline-flex items-center gap-1 font-bold text-[#f7c85b] hover:underline">Receipt info <ArrowUpRight size={13} /></button></div>
              </div>
              <div className="relative mt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8176]">Context</p>
                <dl className="mt-3 divide-y divide-[#e8e0d5]">
                  <div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#837a70]">Merchant</dt><dd className="text-right font-bold">{selected.vendor}</dd></div>
                  <div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#837a70]">Spend lane</dt><dd className={`text-right font-bold ${(CATEGORY_STYLES[selected.category] ?? FALLBACK_STYLE).ink}`}>{selected.category}</dd></div>
                  <div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#837a70]">Memo</dt><dd className="max-w-[65%] text-right font-semibold">{selected.note}</dd></div>
                </dl>
              </div>
              <div id="policy" className="relative mt-6 rounded-2xl border border-[#e2d9cc] bg-white/70 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#665f57]"><ShieldCheck size={16} /> Training policy checks</p>
                <div className="mt-3 space-y-2">{checkExpensePolicy(selected).map(check => <div key={check.label} className="flex gap-2 text-xs"><span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] text-white ${check.passed ? 'bg-[#1b9c8d]' : 'bg-[#d87935]'}`}>{check.passed ? '✓' : '!'}</span><p><strong>{check.label}:</strong> {check.detail}</p></div>)}</div>
                <p className="mt-3 text-[11px] text-[#837a70]">These are synthetic teaching rules, not a real company policy or approval.</p>
              </div>
              <div className="relative mt-7 flex gap-3">
                <button onClick={() => toggleReviewed(selected.id)} className={`flex-1 rounded-xl px-4 py-3 text-sm font-extrabold transition ${reviewed.includes(selected.id) ? 'bg-[#e5f6f1] text-[#157467]' : 'bg-[#1f3040] text-white hover:bg-[#30485c]'}`}>{reviewed.includes(selected.id) ? <span className="inline-flex items-center gap-2"><Check size={16} /> Reviewed</span> : 'Mark reviewed'}</button>
                <button onClick={goNext} disabled={filtered.length < 2} className="inline-flex items-center gap-1 rounded-xl border border-[#ded6ca] bg-white px-4 text-sm font-bold text-[#665f57] hover:bg-[#f5f1e8] disabled:cursor-not-allowed disabled:opacity-45">Next <ChevronRight size={16} /></button>
              </div>
            </>
          )}
        </article>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto border-[#ded6ca] bg-[#fcfaf6] sm:max-w-lg">
          <form onSubmit={submitForm}>
            <DialogHeader><DialogTitle className="text-xl font-black">{editing ? 'Edit the record' : 'Add to the desk'}</DialogTitle><DialogDescription>Saved only in this browser. This does not modify Git files.</DialogDescription></DialogHeader>
            <div className="mt-5 grid gap-4">
              {formError && <p role="alert" className="rounded-xl bg-[#fff0ed] p-3 text-sm font-semibold text-[#8d3524]">{formError}</p>}
              <Field label="Expense description" id="description"><input id="description" autoFocus value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className="desk-input" /></Field>
              <Field label="Merchant" id="vendor"><input id="vendor" value={form.vendor} onChange={event => setForm({ ...form, vendor: event.target.value })} className="desk-input" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Amount (USD)" id="amount"><input id="amount" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} className="desk-input" /></Field>
                <Field label="Date" id="date"><input id="date" type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} className="desk-input" /></Field>
              </div>
              <Field label="Spend lane" id="category"><select id="category" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} className="desk-input">{EDIT_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Business memo" id="note"><textarea id="note" rows={3} value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} className="desk-input resize-none" /></Field>
              <div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-bold">Cancel</button><button type="submit" className="rounded-xl bg-[#f6c85d] px-5 py-3 text-sm font-extrabold text-[#25313a]">{editing ? 'Save changes' : 'Add for review'}</button></div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="border-[#ded6ca] bg-[#fcfaf6] sm:max-w-md"><DialogHeader><DialogTitle className="font-black">Receipt information</DialogTitle><DialogDescription>No receipt file is attached to this browser-only training record.</DialogDescription></DialogHeader><div className="rounded-xl border border-[#e8e0d5] bg-white p-4 text-sm text-[#665f57]"><p><strong>Record:</strong> {selected ? displayTitle(selected) : 'Unavailable'}</p><p className="mt-2"><strong>Reference:</strong> {selected?.id ?? 'Unavailable'}</p><p className="mt-3 text-xs">The app does not upload or store receipt files and will not pretend one exists.</p></div></DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="border-[#ded6ca] bg-[#fcfaf6] sm:max-w-md"><DialogHeader><DialogTitle className="font-black">Delete this record?</DialogTitle><DialogDescription>This removes the browser copy only. It cannot affect repository files.</DialogDescription></DialogHeader><div className="flex justify-end gap-3"><button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-bold">Keep record</button><button onClick={confirmDelete} className="rounded-xl bg-[#9c4a3a] px-4 py-3 text-sm font-bold text-white">Delete record</button></div></DialogContent>
      </Dialog>
    </section>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><label htmlFor={id} className="text-sm font-bold text-[#4d4944]">{label}</label>{children}</div>
}