'use client'

import { useDashboardStats } from './useDashboardStats'
import { useRecentActivity } from './useRecentActivity'
import { useUpcomingDeadlines } from './useUpcomingDeadlines'
import { useRealtimeDashboard } from './useRealtimeDashboard'
import { useCallback } from 'react'

// Combined hook for all dashboard data with real-time updates
export function useDashboard() {
  const stats = useDashboardStats()
  const activity = useRecentActivity(10)
  const deadlines = useUpcomingDeadlines(8)

  // Set up real-time subscriptions with optimized callbacks
  const realtimeCallbacks = {
    onProjectsChange: useCallback(() => {
      console.log('Projects changed - updating dashboard')
      stats.refetchSilent?.()
      activity.refetchSilent?.()
      deadlines.refetchSilent?.()
    }, [stats.refetchSilent, activity.refetchSilent, deadlines.refetchSilent]),

    onProposalsChange: useCallback(() => {
      console.log('Proposals changed - updating dashboard')
      stats.refetchSilent?.()
      activity.refetchSilent?.()
    }, [stats.refetchSilent, activity.refetchSilent]),

    onInvoicesChange: useCallback(() => {
      console.log('Invoices changed - updating dashboard')
      stats.refetchSilent?.()
      activity.refetchSilent?.()
    }, [stats.refetchSilent, activity.refetchSilent]),

    onTimeEntriesChange: useCallback(() => {
      console.log('Time entries changed - updating dashboard')
      stats.refetchSilent?.()
    }, [stats.refetchSilent]),

    onMilestonesChange: useCallback(() => {
      console.log('Milestones changed - updating dashboard')
      deadlines.refetchSilent?.()
      activity.refetchSilent?.()
    }, [deadlines.refetchSilent, activity.refetchSilent]),

    onTasksChange: useCallback(() => {
      console.log('Tasks changed - updating dashboard')
      deadlines.refetchSilent?.()
    }, [deadlines.refetchSilent])
  }

  // Set up real-time subscriptions
  const realtimeStatus = useRealtimeDashboard(realtimeCallbacks)

  const isLoading = stats.loading || activity.loading || deadlines.loading
  const hasError = stats.error || activity.error || deadlines.error

  const refetchAll = async () => {
    await Promise.all([
      stats.refetch(),
      activity.refetch(),
      deadlines.refetch()
    ])
  }

  return {
    stats: {
      data: stats.stats,
      loading: stats.loading,
      error: stats.error,
      refetch: stats.refetch
    },
    activity: {
      data: activity.activities,
      loading: activity.loading,
      error: activity.error,
      refetch: activity.refetch,
      hasMore: activity.hasMore,
      loadMore: activity.loadMore
    },
    deadlines: {
      data: deadlines.deadlines,
      loading: deadlines.loading,
      error: deadlines.error,
      refetch: deadlines.refetch,
      overdueTasks: deadlines.overdueTasks,
      urgentTasks: deadlines.urgentTasks
    },
    realtime: {
      isConnected: realtimeStatus.isConnected,
      activeSubscriptions: realtimeStatus.activeSubscriptions
    },
    isLoading,
    hasError,
    refetchAll
  }
}