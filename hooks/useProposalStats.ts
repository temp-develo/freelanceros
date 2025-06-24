'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getProposalStats } from '@/lib/supabase/proposals'
import { useProposalRealtime } from './useProposalRealtime'

interface ProposalStats {
  counts: {
    total: number
    draft: number
    sent: number
    viewed: number
    accepted: number
    rejected: number
    expired: number
  }
  conversionRate: number
  totalAcceptedValue: number
}

interface UseProposalStatsReturn {
  stats: ProposalStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isRealtime: boolean
}

export function useProposalStats(enableRealtime: boolean = true): UseProposalStatsReturn {
  const { user } = useAuth()
  const [stats, setStats] = useState<ProposalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const stats = await getProposalStats(user.id)
      setStats(stats)
    } catch (err) {
      console.error('Error fetching proposal stats:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch proposal stats'))
    } finally {
      setLoading(false)
    }
  }, [user])

  // Set up real-time updates
  const { isConnected } = useProposalRealtime({
    onProposalChange: enableRealtime ? fetchStats : undefined
  })

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    isRealtime: isConnected
  }
}