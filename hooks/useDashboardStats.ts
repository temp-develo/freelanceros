'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { DashboardStats, UseDashboardStatsReturn } from '@/types/dashboard'

export function useDashboardStats(): UseDashboardStatsReturn {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
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

      // Get current date ranges for comparison
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // Fetch active projects count
      const { data: activeProjectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (projectsError) throw projectsError

      // Fetch pending proposals count
      const { data: pendingProposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('id, created_at')
        .eq('user_id', user.id)
        .in('status', ['sent', 'viewed'])

      if (proposalsError) throw proposalsError

      // Fetch current month revenue from invoices
      const { data: currentMonthInvoices, error: currentInvoicesError } = await supabase
        .from('invoices')
        .select('amount, paid_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('paid_at', currentMonthStart.toISOString())

      if (currentInvoicesError) throw currentInvoicesError

      // Fetch last month revenue for comparison
      const { data: lastMonthInvoices, error: lastInvoicesError } = await supabase
        .from('invoices')
        .select('amount, paid_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('paid_at', lastMonthStart.toISOString())
        .lte('paid_at', lastMonthEnd.toISOString())

      if (lastInvoicesError) throw lastInvoicesError

      // Fetch current month time entries
      const { data: currentMonthTimeEntries, error: currentTimeError } = await supabase
        .from('time_entries')
        .select('duration, date')
        .eq('user_id', user.id)
        .gte('date', currentMonthStart.toISOString().split('T')[0])

      if (currentTimeError) throw currentTimeError

      // Fetch last month time entries for comparison
      const { data: lastMonthTimeEntries, error: lastTimeError } = await supabase
        .from('time_entries')
        .select('duration, date')
        .eq('user_id', user.id)
        .gte('date', lastMonthStart.toISOString().split('T')[0])
        .lte('date', lastMonthEnd.toISOString().split('T')[0])

      if (lastTimeError) throw lastTimeError

      // Fetch projects from last month for comparison
      const { data: lastMonthProjects, error: lastProjectsError } = await supabase
        .from('projects')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      if (lastProjectsError) throw lastProjectsError

      // Fetch proposals from last month for comparison
      const { data: lastMonthProposals, error: lastProposalsError } = await supabase
        .from('proposals')
        .select('id, created_at')
        .eq('user_id', user.id)
        .in('status', ['sent', 'viewed'])
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      if (lastProposalsError) throw lastProposalsError

      // Calculate stats
      const activeProjects = activeProjectsData?.length || 0
      const pendingProposals = pendingProposalsData?.length || 0
      
      const monthlyRevenue = currentMonthInvoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0
      const lastMonthRevenue = lastMonthInvoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0
      
      const hoursTracked = Math.round((currentMonthTimeEntries?.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0) / 60)
      const lastMonthHours = Math.round((lastMonthTimeEntries?.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0) / 60)

      // Calculate changes
      const activeProjectsChange = activeProjects - (lastMonthProjects?.length || 0)
      const pendingProposalsChange = pendingProposals - (lastMonthProposals?.length || 0)
      const monthlyRevenueChange = monthlyRevenue - lastMonthRevenue
      const hoursTrackedChange = hoursTracked - lastMonthHours

      const dashboardStats: DashboardStats = {
        activeProjects,
        pendingProposals,
        monthlyRevenue,
        hoursTracked,
        activeProjectsChange,
        pendingProposalsChange,
        monthlyRevenueChange,
        hoursTrackedChange
      }

      setStats(dashboardStats)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'))
    } finally {
      setLoading(false)
    }
  }, [user])

  const refetch = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch
  }
}