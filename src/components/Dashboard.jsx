import React from 'react'
import StatsCard from './StatsCard'
import Charts from './Charts'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import { useTransactions } from '../hooks/useTransactions'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { LogOut, Layers } from 'lucide-react'

export default function Dashboard({ user }) {
  const {
    transactions, loading,
    addTransaction, deleteTransaction,
    totalIncome, totalExpense, balance
  } = useTransactions(user.uid)

  const handleLogout = () => signOut(auth)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layers size={18} color="#0a0f00" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>FlowLedger</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)',
              padding: '8px 14px', fontSize: 13, fontFamily: 'var(--font-display)',
              transition: 'color 0.15s, border-color 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatsCard label="Balance" value={balance} type="balance" />
        <StatsCard label="Total Income" value={totalIncome} type="income" />
        <StatsCard label="Total Expenses" value={totalExpense} type="expense" />
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <TransactionForm onAdd={addTransaction} />
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Charts transactions={transactions} />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      )}
    </div>
  )
}
