import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  FilePlus2,
  Layers3,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Expense = {
  id: number;
  date: string;
  title: string;
  vendor: string;
  category: "Technology" | "Legal" | "Operations";
  amount: number;
  note: string;
};

const expenses: Expense[] = [
  { id: 1, date: "15 Sep", title: "Q3 Cloud Hosting", vendor: "Northstar Cloud", category: "Technology", amount: 4500, note: "Infrastructure renewal · monthly" },
  { id: 2, date: "01 Oct", title: "Annual Legal Retainer", vendor: "Ridge & Lane", category: "Legal", amount: 12000, note: "Contract coverage · FY24" },
  { id: 3, date: "15 Oct", title: "Office Supplies", vendor: "Paper District", category: "Operations", amount: 350.5, note: "Studio replenishment" },
];

const categoryStyles = {
  Technology: { dot: "bg-[#ff754b]", tint: "bg-[#fff0e8]", ink: "text-[#a43d20]" },
  Legal: { dot: "bg-[#745fe8]", tint: "bg-[#f0edff]", ink: "text-[#4b38a4]" },
  Operations: { dot: "bg-[#1b9c8d]", tint: "bg-[#e5f6f1]", ink: "text-[#157467]" },
};

export function ExpenseReviewOrbit() {
  const [activeCategory, setActiveCategory] = useState<"All" | Expense["category"]>("All");
  const [selectedId, setSelectedId] = useState(1);
  const [reviewed, setReviewed] = useState<number[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          (activeCategory === "All" || expense.category === activeCategory) &&
          `${expense.title} ${expense.vendor}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [activeCategory, query],
  );
  const selected = expenses.find((expense) => expense.id === selectedId) ?? filtered[0] ?? expenses[0];
  const isReviewed = reviewed.includes(selected.id);

  const markReviewed = () => {
    setReviewed((items) => (items.includes(selected.id) ? items.filter((id) => id !== selected.id) : [...items, selected.id]));
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f6f3ed] text-[#1c2730]" style={{ fontFamily: "'Trebuchet MS', ui-sans-serif, system-ui" }}>
      <div className="mx-auto min-h-[100dvh] max-w-[1510px] p-4 lg:p-6">
        <div className="grid min-h-[calc(100dvh-3rem)] grid-cols-1 overflow-hidden rounded-[28px] border border-[#e4ddd2] bg-[#fcfaf6] shadow-[0_26px_70px_rgba(48,38,25,0.13)] lg:grid-cols-[278px_minmax(0,1fr)]">
          <aside className="flex flex-col border-b border-[#e8e0d5] bg-[#f0ece4] p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f3040] text-[#f7c85b] shadow-sm"><CircleDollarSign size={22} /></div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a746b]">Finance practice</p>
                <h1 className="text-lg font-black tracking-tight">Ledger Room</h1>
              </div>
            </div>

            <div className="mt-9">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8d857a]">Workspace</p>
              <div className="mt-3 space-y-1">
                <button className="flex w-full items-center gap-3 rounded-xl bg-[#1f3040] px-3 py-3 text-left text-sm font-bold text-white shadow-sm">
                  <Layers3 size={17} className="text-[#f7c85b]" /> Review queue <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[11px]">03</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#665f57] transition hover:bg-white/60">
                  <ShieldCheck size={17} /> Policy checks
                </button>
              </div>
            </div>

            <div className="mt-9">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8d857a]">Spend lanes</p>
              <div className="mt-3 space-y-1">
                {(["All", "Technology", "Legal", "Operations"] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${activeCategory === category ? "bg-white text-[#1f3040] shadow-sm" : "text-[#665f57] hover:bg-white/60"}`}
                  >
                    {category === "All" ? <span className="h-2.5 w-2.5 rounded-full bg-[#f7c85b]" /> : <span className={`h-2.5 w-2.5 rounded-full ${categoryStyles[category].dot}`} />}
                    {category}
                    <span className="ml-auto text-xs text-[#938a7f]">{category === "All" ? "03" : "01"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-[#ddd5c9] bg-[#f9f6ef] p-4">
              <Sparkles size={18} className="text-[#d87935]" />
              <p className="mt-3 text-sm font-bold leading-snug">Review before you record.</p>
              <p className="mt-1 text-xs leading-relaxed text-[#716a62]">A focused pass makes categorisation a habit, not cleanup.</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e0d5] px-6 py-5 lg:px-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a16642]">October close · 3 items waiting</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight lg:text-3xl">Your review desk</h2>
              </div>
              <button onClick={() => setComposerOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#f6c85d] px-4 py-3 text-sm font-extrabold text-[#25313a] shadow-[0_5px_0_#d7a837] transition hover:translate-y-[1px] hover:shadow-[0_4px_0_#d7a837]">
                <FilePlus2 size={17} /> Capture expense
              </button>
            </header>

            <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,0.95fr)_minmax(380px,1.05fr)]">
              <div className="border-b border-[#e8e0d5] p-6 lg:border-b-0 lg:border-r lg:p-8">
                <div className="relative">
                  <Search size={17} className="pointer-events-none absolute left-4 top-3.5 text-[#91897f]" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a merchant or expense" className="w-full rounded-xl border border-[#ded6ca] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa198] focus:border-[#d87935] focus:ring-4 focus:ring-[#f9dfb7]" />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div><p className="text-sm font-bold">In the queue</p><p className="mt-1 text-xs text-[#837b71]">Select one to inspect its trail.</p></div>
                  <p className="text-xs font-bold text-[#837b71]">{filtered.length} records</p>
                </div>

                <div className="mt-5 space-y-3">
                  {filtered.map((expense) => {
                    const style = categoryStyles[expense.category];
                    const active = expense.id === selected.id;
                    const done = reviewed.includes(expense.id);
                    return (
                      <button key={expense.id} onClick={() => setSelectedId(expense.id)} className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${active ? "border-[#d87935] bg-[#fff6e7] shadow-[0_8px_18px_rgba(177,107,49,0.09)]" : "border-[#e8e0d5] bg-white hover:border-[#d7c2aa]"}`}>
                        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${style.tint} ${style.ink}`}><span className="text-sm font-black">{expense.vendor.slice(0, 1)}</span></div>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-extrabold">{expense.title}</p>{done && <Check size={14} className="shrink-0 text-[#1b9c8d]" />}</div><p className="mt-1 truncate text-xs text-[#847b70]">{expense.vendor} · {expense.date}</p></div>
                        <div className="text-right"><p className="text-sm font-black">${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p><span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${style.tint} ${style.ink}`}>{expense.category}</span></div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#d8cfc2] p-9 text-center text-sm text-[#82796e]">Nothing in this lane matches that search.</div>}
                </div>
              </div>

              <article className="relative overflow-hidden bg-[#fdfbf7] p-6 lg:p-8">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#f9e2b4] opacity-55 blur-3xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a16642]">Record detail</p><h3 className="mt-2 text-2xl font-black tracking-tight">{selected.title}</h3></div>
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#ded6ca] bg-white text-[#766d63] hover:bg-[#f5f1e8]"><MoreHorizontal size={18} /></button>
                </div>
                <div className="relative mt-8 rounded-[22px] bg-[#1f3040] p-6 text-white shadow-[0_15px_32px_rgba(31,48,64,0.22)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9c3ca]">Outflow</p>
                  <p className="mt-2 text-4xl font-black tracking-tight">${selected.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-[#cbd3d7]"><span>Recorded {selected.date}, 2023</span><span className="inline-flex items-center gap-1 font-bold text-[#f7c85b]">View receipt <ArrowUpRight size={13} /></span></div>
                </div>
                <div className="relative mt-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8176]">Context</p>
                  <dl className="mt-3 divide-y divide-[#e8e0d5]">
                    <div className="flex justify-between py-3 text-sm"><dt className="text-[#837a70]">Merchant</dt><dd className="font-bold">{selected.vendor}</dd></div>
                    <div className="flex justify-between py-3 text-sm"><dt className="text-[#837a70]">Spend lane</dt><dd className={`font-bold ${categoryStyles[selected.category].ink}`}>{selected.category}</dd></div>
                    <div className="flex justify-between py-3 text-sm"><dt className="text-[#837a70]">Memo</dt><dd className="font-semibold">{selected.note}</dd></div>
                  </dl>
                </div>
                <div className="relative mt-7 flex gap-3">
                  <button onClick={markReviewed} className={`flex-1 rounded-xl px-4 py-3 text-sm font-extrabold transition ${isReviewed ? "bg-[#e5f6f1] text-[#157467]" : "bg-[#1f3040] text-white hover:bg-[#30485c]"}`}>{isReviewed ? <span className="inline-flex items-center gap-2"><Check size={16} /> Reviewed</span> : "Mark reviewed"}</button>
                  <button className="inline-flex items-center gap-1 rounded-xl border border-[#ded6ca] bg-white px-4 text-sm font-bold text-[#665f57] hover:bg-[#f5f1e8]">Next <ChevronRight size={16} /></button>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>

      {composerOpen && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-[#1f3040]/35 p-4">
          <div className="w-full max-w-md rounded-[24px] bg-[#fcfaf6] p-6 shadow-2xl">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a16642]">Quick capture</p><h4 className="mt-1 text-xl font-black">Add to the desk</h4></div><button onClick={() => setComposerOpen(false)} className="rounded-lg p-2 text-[#766d63] hover:bg-[#f0ece4]"><X size={18} /></button></div>
            <div className="mt-6 grid gap-3"><input autoFocus placeholder="What did the team buy?" className="rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm outline-none focus:border-[#d87935]" /><div className="grid grid-cols-2 gap-3"><input placeholder="$ Amount" className="rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm outline-none focus:border-[#d87935]" /><select className="rounded-xl border border-[#ded6ca] bg-white px-3 py-3 text-sm"><option>Technology</option><option>Legal</option><option>Operations</option></select></div><button onClick={() => setComposerOpen(false)} className="mt-2 rounded-xl bg-[#f6c85d] py-3 text-sm font-extrabold text-[#25313a]">Add for review</button></div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ExpenseReviewOrbit;