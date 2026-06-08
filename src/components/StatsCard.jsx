import React from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export default function StatsCard({ label, value, trend, type }) {
  const isNegative = type === 'expense'
  const color = isNegative ? 'var(--red)' : 'var(--accent)'
  const glow = isNegative ? 'var(--red-glow)' : 'var(--accent-glow)'

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: glow,
        borderRadius: '50%',
        filter: 'blur(30px)',
        transform: 'translate(20px, -20px)'
      }} />
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 12
      }}>
        <span style={{
          fontSize: 11, color: 'var(--text-secondary)',
          letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>
          {label}
        </span>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontFamily: 'var(--font-mono)',
            color: trend >= 0 ? 'var(--accent)' : 'var(--red)',
            background: trend >= 0 ? 'rgba(163,230,53,0.1)' : 'rgba(248,81,73,0.1)',
            padding: '2px 8px', borderRadius: 6
          }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{
        fontSize: 'clamp(20px, 4vw, 28px)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-mono)',
        color,
        wordBreak: 'break-all'
      }}>
        {fmt(value)}
      </div>
    </div>
  )
}
