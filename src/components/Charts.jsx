import React, { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import { format, parseISO, subDays } from 'date-fns'

const COLORS_EXP = ['#a3e635', '#f85149', '#38bdf8', '#fb923c', '#c084fc', '#34d399']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px',
      fontFamily: 'var(--font-mono)', fontSize: 12
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: ${Number(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  )
}

export default function Charts({ transactions }) {
  const last30 = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i)
      const key = format(d, 'yyyy-MM-dd')
      const dayTxs = transactions.filter(t => t.date === key)
      return {
        date: format(d, 'MMM d'),
        income: dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      }
    })
  }, [transactions])

  const categoryData = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount)
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '22px',
  }

  const labelStyle = {
    fontSize: 11, color: 'var(--text-secondary)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 18, display: 'block'
  }

  return (
    <div className="charts-grid">
      {/* Area Chart — full width */}
      <div style={{ ...cardStyle }} className="full-width">
        <span style={labelStyle}>30-Day Cash Flow</span>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={last30} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f85149" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f85149" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date"
              tick={{ fill: '#484f58', fontSize: 10, fontFamily: 'DM Mono' }}
              tickLine={false} axisLine={false} interval={4} />
            <YAxis
              tick={{ fill: '#484f58', fontSize: 10, fontFamily: 'DM Mono' }}
              tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#a3e635" strokeWidth={2}
              fill="url(#incGrad)" name="Income" dot={false} />
            <Area type="monotone" dataKey="expense" stroke="#f85149" strokeWidth={2}
              fill="url(#expGrad)" name="Expense" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div style={cardStyle}>
        <span style={labelStyle}>Monthly Bars</span>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={last30.filter((_, i) => i % 3 === 0)}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date"
              tick={{ fill: '#484f58', fontSize: 9, fontFamily: 'DM Mono' }}
              tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#a3e635" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#f85149" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={cardStyle}>
        <span style={labelStyle}>Expense by Category</span>
        {categoryData.length === 0 ? (
          <div style={{
            height: 160, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13
          }}>
            No expense data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%"
                innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS_EXP[i % COLORS_EXP.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 8 }}>
          {categoryData.map((c, i) => (
            <span key={i} style={{
              fontSize: 11, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              display: 'flex', alignItems: 'center', gap: 5
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: COLORS_EXP[i % COLORS_EXP.length],
                display: 'inline-block', flexShrink: 0
              }} />
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
