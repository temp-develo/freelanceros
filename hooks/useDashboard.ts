'use client'

import { useDashboardStats } from './useDashboardStats'
import { useRecentActivity } from './useRecentActivity'
import { useUpcomingDeadlines } from './useUpcomingDeadlines'

// Combined hook for all dashboard data
export function useDashboard() {
  const stats = useDashboardStats()
  const activity = useRecentActivity(10)
  const deadlines = useUpcomingDeadlines(8)

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
    isLoading,
    hasError,
    refetchAll
  }
}