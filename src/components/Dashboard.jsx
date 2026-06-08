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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 40px' }}>

      {/* Header */}
      <div className="header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Layers size={16} color="#0a0f00" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>
            FlowLedger
          </span>
        </div>

        <div className="header-right">
          <span className="header-email" style={{
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 200
          }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)',
              padding: '8px 12px', fontSize: 13,
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <LogOut size={13} />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
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
        <div style={{
          textAlign: 'center', padding: 40,
          color: 'var(--text-muted)'
        }}>
          Loading...
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
        />
      )}
    </div>
  )
}
