import * as React from "react"
import { Link, useLocation } from "wouter"
import { BookOpen, DollarSign, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()

  const navItems = [
    { href: "/", label: "Expense Tracker", icon: DollarSign },
    { href: "/guide", label: "Git Practice Guide", icon: BookOpen },
  ]

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight leading-tight text-white">CorpFinance</span>
            <span className="text-xs text-slate-400 font-medium">Git Learning Environment</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive 
                      ? "bg-slate-800 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 m-4 rounded-md bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Notice:</strong> This is a frontend-only practice environment. Data is synthetic and stored in localStorage.
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
