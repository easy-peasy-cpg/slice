import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle SSO tokens passed via URL hash from piece-of-pie dashboard
    const hash = window.location.hash
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace('#', ''))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const expires_in = params.get('expires_in')
      const expires_at = params.get('expires_at')
      const token_type = params.get('token_type')
      if (access_token && refresh_token) {
        const sessionData = {
          access_token,
          refresh_token,
          expires_in: Number(expires_in),
          expires_at: Number(expires_at),
          token_type: token_type || 'bearer',
        }
        localStorage.setItem('sb-uodumgdxerorbsctrutw-auth-token', JSON.stringify(sessionData))
        window.history.replaceState(null, '', window.location.pathname)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
