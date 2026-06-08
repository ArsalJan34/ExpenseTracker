import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Utilities', 'Other']
}

export default function TransactionForm({ onAdd, loading }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErr('Enter a valid amount'); return
    }
    if (!category) { setErr('Select a category'); return }
    setErr('')
    setSubmitting(true)
    const { error } = await onAdd({ type, amount: Number(amount), category, note, date })
    setSubmitting(false)
    if (error) { setErr(error.message); return }
    setAmount(''); setCategory(''); setNote('')
    setDate(new Date().toISOString().split('T')[0])
    setOpen(false)
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '11px 14px',
    fontSize: 14, transition: 'border-color 0.2s',
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: '#0a0f00',
          border: 'none', borderRadius: 'var(--radius-sm)',
          padding: '11px 20px', fontWeight: 700, fontSize: 14,
          fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
          transition: 'opacity 0.15s',
          boxShadow: '0 0 20px rgba(163,230,53,0.25)'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <Plus size={16} /> Add Transaction
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(6px)', padding: 20
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 28, width: '100%', maxWidth: 420,
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            animation: 'slideUp 0.2s ease'
          }}>
            <style>{`@keyframes slideUp { from { opacity:0; transform: translateY(16px) } to { opacity:1; transform: translateY(0) } }`}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>New Transaction</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Type Toggle */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
              padding: 4, marginBottom: 18
            }}>
              {['income', 'expense'].map(t => (
                <button key={t} onClick={() => { setType(t); setCategory('') }} style={{
                  padding: '9px', border: 'none', borderRadius: 8,
                  fontWeight: 600, fontSize: 13, textTransform: 'capitalize', letterSpacing: '0.04em',
                  background: type === t ? (t === 'income' ? 'var(--accent)' : 'var(--red)') : 'transparent',
                  color: type === t ? (t === 'income' ? '#0a0f00' : '#fff') : 'var(--text-secondary)',
                  transition: 'all 0.15s'
                }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Amount (USD)</label>
                <input
                  type="number" placeholder="0.00" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                >
                  <option value="">Select category</option>
                  {CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Note (optional)</label>
                <input type="text" placeholder="What was this for?" value={note}
                  onChange={e => setNote(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {err && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 10 }}>{err}</div>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%', marginTop: 20, padding: '13px',
                background: type === 'income' ? 'var(--accent)' : 'var(--red)',
                color: type === 'income' ? '#0a0f00' : '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)',
                opacity: submitting ? 0.6 : 1, transition: 'opacity 0.15s',
                boxShadow: type === 'income' ? '0 0 20px rgba(163,230,53,0.2)' : '0 0 20px rgba(248,81,73,0.2)'
              }}
            >
              {submitting ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
