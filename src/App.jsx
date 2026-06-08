import React, { useState, useEffect } from 'react'
import { auth } from './lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import Dashboard from './components/Dashboard'
import { Layers, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const handleAuth = async () => {
    setErr('')
    if (!email || !password) { setErr('Fill in all fields'); return }
    setSubmitting(true)
try {
  if (mode === 'signup') {

    // Create account
    await createUserWithEmailAndPassword(auth, email, password)

    // Logout immediately
    await signOut(auth)

    // Switch back to login page
    setMode('login')

    // Clear password field
    setPassword('')

    // Success message
    setErr('Account created successfully. Please sign in.')

  } else {

    // Login normally
    await signInWithEmailAndPassword(auth, email, password)

  }
} catch (e) {
      const messages = {
        'auth/user-not-found': 'No account with that email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/invalid-credential': 'Invalid email or password',
      }
      setErr(messages[e.code] || e.message)
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 36, height: 36, border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (user) return <Dashboard user={user} />

  const inputStyle = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    padding: '12px 42px 12px 40px', fontSize: 14, transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '36px 32px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.3s ease'
      }}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: none } }`}</style>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 52, height: 52, background: 'var(--accent)', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 0 28px rgba(163,230,53,0.3)'
          }}>
            <Layers size={24} color="#0a0f00" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>FlowLedger</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
            />
            <button onClick={() => setShowPass(!showPass)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-muted)', padding: 2
            }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {err && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 10 }}>{err}</div>}

        <button
          onClick={handleAuth}
          disabled={submitting}
          style={{
            width: '100%', marginTop: 18, padding: '13px',
            background: 'var(--accent)', color: '#0a0f00',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)',
            opacity: submitting ? 0.6 : 1, transition: 'opacity 0.15s',
            boxShadow: '0 0 24px rgba(163,230,53,0.2)', letterSpacing: '0.02em'
          }}
        >
          {submitting ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr('') }}
            style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 13, cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
