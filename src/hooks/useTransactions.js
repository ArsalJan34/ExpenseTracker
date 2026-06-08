import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import {
  ref, push, remove, onValue, off, serverTimestamp
} from 'firebase/database'

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const txRef = ref(db, `transactions/${userId}`)

    const unsubscribe = onValue(txRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }))
        // Sort by date descending, then by createdAt descending
        list.sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date)
          return (b.createdAt || 0) - (a.createdAt || 0)
        })
        setTransactions(list)
      } else {
        setTransactions([])
      }
      setLoading(false)
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return () => off(txRef, 'value', unsubscribe)
  }, [userId])

  const addTransaction = async (tx) => {
    try {
      const txRef = ref(db, `transactions/${userId}`)
      await push(txRef, {
        ...tx,
        amount: Number(tx.amount),
        createdAt: Date.now()
      })
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const txRef = ref(db, `transactions/${userId}/${id}`)
      await remove(txRef)
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return {
    transactions, loading, error,
    addTransaction, deleteTransaction,
    totalIncome, totalExpense, balance
  }
}
