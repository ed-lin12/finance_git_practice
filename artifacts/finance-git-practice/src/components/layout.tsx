import * as React from "react"
import { Link, useLocation } from "wouter"
import { BookOpen, CircleDollarSign, Layers3, ShieldCheck, Sparkles } from "lucide-react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#f6f3ed] p-0 text-[#1c2730] sm:p-3 lg:p-6">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1510px] grid-cols-1 overflow-hidden border border-[#e4ddd2] bg-[#fcfaf6] shadow-[0_26px_70px_rgba(48,38,25,0.13)] sm:min-h-[calc(100dvh-1.5rem)] sm:rounded-[24px] lg:min-h-[calc(100dvh-3rem)] lg:grid-cols-[278px_minmax(0,1fr)] lg:rounded-[28px]">
        <aside className="flex flex-col border-b border-[#e8e0d5] bg-[#f0ece4] p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f3040] text-[#f7c85b] shadow-sm"><CircleDollarSign size={22} /></div>
            <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a746b]">Finance practice</p><p className="text-lg font-black tracking-tight">Ledger Room</p></div>
          </div>

          <div className="mt-4 lg:mt-9">
            <p className="hidden px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8d857a] lg:block">Workspace</p>
            <nav className="mt-1 flex gap-2 overflow-x-auto pb-1 lg:mt-3 lg:block lg:space-y-1">
              <Link href="/" className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition lg:w-full ${location === '/' ? 'bg-[#1f3040] text-white shadow-sm' : 'text-[#665f57] hover:bg-white/60'}`}>
                <Layers3 size={17} className={location === '/' ? 'text-[#f7c85b]' : ''} /> Review queue
              </Link>
              <a href={location === '/' ? '#policy' : './#policy'} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#665f57] transition hover:bg-white/60 lg:w-full">
                <ShieldCheck size={17} /> Policy checks
              </a>
              <Link href="/guide" className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition lg:w-full ${location === '/guide' ? 'bg-[#1f3040] text-white shadow-sm' : 'text-[#665f57] hover:bg-white/60'}`}>
                <BookOpen size={17} className={location === '/guide' ? 'text-[#f7c85b]' : ''} /> Git practice guide
              </Link>
            </nav>
          </div>

          <div className="mt-auto hidden rounded-2xl border border-[#ddd5c9] bg-[#f9f6ef] p-4 lg:block">
            <Sparkles size={18} className="text-[#d87935]" />
            <p className="mt-3 text-sm font-bold leading-snug">Review before you record.</p>
            <p className="mt-1 text-xs leading-relaxed text-[#716a62]">Synthetic data is saved locally. Browser edits are not Git edits.</p>
          </div>
        </aside>
        <main className="flex min-w-0 flex-col">{children}</main>
      </div>
    </div>
  )
}