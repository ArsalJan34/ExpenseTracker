import React, { useState } from 'react'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function TransactionList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const filtered = transactions.filter(t =>
    filter === 'all' ? true : t.type === filter
  )

  const handleDelete = async (id) => {
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  const tabStyle = (active) => ({
    padding: '7px 12px', border: 'none', borderRadius: 8,
    fontWeight: 600, fontSize: 11,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: 'var(--font-display)',
    whiteSpace: 'nowrap'
  })

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '22px 18px'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 18,
        flexWrap: 'wrap', gap: 10
      }}>
        <span style={{
          fontSize: 11, color: 'var(--text-secondary)',
          letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>
          Transactions
        </span>
        <div style={{
          display: 'flex', gap: 3,
          background: 'var(--bg-input)',
          padding: 3, borderRadius: 10
        }}>
          {['all', 'income', 'expense'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={tabStyle(filter === f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 0',
          color: 'var(--text-muted)', fontSize: 14
        }}>
          No transactions yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(tx => (
            <div
              key={tx.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 12px',
                border: '1px solid transparent',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              {/* Icon */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: tx.type === 'income'
                  ? 'rgba(163,230,53,0.12)'
                  : 'rgba(248,81,73,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {tx.type === 'income'
                  ? <TrendingUp size={14} color="var(--accent)" />
                  : <TrendingDown size={14} color="var(--red)" />}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, marginBottom: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {tx.category}
                </div>
                <div style={{
                  fontSize: 11, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {tx.note || '—'} · {format(parseISO(tx.date), 'MMM d, yyyy')}
                </div>
              </div>

              {/* Amount */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 600,
                fontSize: 'clamp(12px, 3vw, 15px)',
                color: tx.type === 'income' ? 'var(--accent)' : 'var(--red)',
                flexShrink: 0
              }}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(tx.id)}
                disabled={deleting === tx.id}
                style={{
                  background: 'none', border: 'none', padding: 6,
                  color: 'var(--text-muted)', flexShrink: 0,
                  opacity: deleting === tx.id ? 0.4 : 1,
                  transition: 'color 0.15s, opacity 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
