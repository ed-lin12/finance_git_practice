import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, AlertCircle } from 'lucide-react'
import { useExpenses, type Expense } from '@/lib/store'
import { formatCents } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function ExpensesPage() {
  const { expenses, addExpense, editExpense, deleteExpense } = useExpenses()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    category: 'Technology',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  })
  const [formError, setFormError] = useState('')

  const categories = ['All', 'Technology', 'Legal', 'Operations', 'Marketing', 'Travel']

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalCents = filteredExpenses.reduce((acc, curr) => acc + curr.amountCents, 0)

  const openAddModal = () => {
    setEditingExpense(null)
    setFormData({
      description: '',
      category: 'Technology',
      date: new Date().toISOString().split('T')[0],
      amount: ''
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp)
    setFormData({
      description: exp.description,
      category: exp.category,
      date: exp.date,
      amount: (exp.amountCents / 100).toString()
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (!formData.description || !formData.amount || !formData.date) {
      setFormError('Please fill in all fields.')
      return
    }

    const amountFloat = parseFloat(formData.amount)
    if (isNaN(amountFloat) || amountFloat <= 0) {
      setFormError('Please enter a valid positive amount.')
      return
    }

    const payload = {
      description: formData.description,
      category: formData.category,
      date: formData.date,
      amountCents: Math.round(amountFloat * 100)
    }

    if (editingExpense) {
      editExpense(editingExpense.id, payload)
    } else {
      addExpense(payload)
    }
    
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Important: UI Edits vs Git Edits</p>
          <p>
            Modifying expenses using these buttons only saves to your browser's LocalStorage. 
            <strong> This does not create a Git commit or change actual files in the repository.</strong> 
            To practice Git workflows, follow the Practice Guide and edit the markdown files directly.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense Tracker</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage departmental expenditures and track budgets.</p>
        </div>
        <Button onClick={openAddModal} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search description..." 
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No expenses found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{exp.date}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {exp.description}
                        {exp.description.includes('Synthetic:') && (
                          <Badge variant="secondary" className="ml-2 text-[10px] uppercase">Synthetic</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">{exp.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {formatCents(exp.amountCents)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary" onClick={() => openEditModal(exp)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-destructive" onClick={() => deleteExpense(exp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-slate-500">Showing {filteredExpenses.length} transaction(s)</span>
            <div className="font-medium text-base">
              Total: <span className="text-slate-900 font-bold ml-1">{formatCents(totalCents)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription>
                Remember: this only modifies browser storage, not Git tracking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {formError && (
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                  {formError}
                </div>
              )}
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input 
                  id="description" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g. Server Hosting"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="amount" className="text-sm font-medium">Amount (USD)</label>
                  <Input 
                    id="amount" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
