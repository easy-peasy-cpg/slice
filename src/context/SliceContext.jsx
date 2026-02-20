import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SliceContext = createContext({})

export function SliceProvider({ children }) {
  const { user } = useAuth()
  const [skus, setSkus] = useState([])
  const [stores, setStores] = useState([])
  const [salesReports, setSalesReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [skusRes, storesRes, reportsRes] = await Promise.all([
      supabase.from('skus').select('*').eq('user_id', user.id).order('name'),
      supabase.from('stores').select('*').eq('user_id', user.id).order('retailer', { ascending: true }),
      supabase
        .from('sales_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(500),
    ])

    setSkus(skusRes.data ?? [])
    setStores(storesRes.data ?? [])
    setSalesReports(reportsRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <SliceContext.Provider value={{ skus, stores, salesReports, loading, refetch: fetchAll }}>
      {children}
    </SliceContext.Provider>
  )
}

export const useSlice = () => useContext(SliceContext)
