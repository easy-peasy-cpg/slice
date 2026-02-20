import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
  const { user, signIn } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) toast.error(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) toast.error(error.message)
      else toast.success('Account created! You can now sign in.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-slate-800 tracking-tight">Slice</span>
          </div>
          <p className="text-slate-500 text-sm">Retail sales intelligence for CPG brands</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white placeholder-slate-400 outline-none"
                placeholder="you@brand.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white placeholder-slate-400 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-emerald-500 hover:text-emerald-600 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Slice — Retail Sales Intelligence for CPG Brands
        </p>
      </div>
    </div>
  )
}
