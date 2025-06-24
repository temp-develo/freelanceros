'use client'

import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface RealtimeSubscriptionOptions {
  onProjectsChange?: () => void
  onProposalsChange?: () => void
  onInvoicesChange?: () => void
  onTimeEntriesChange?: () => void
  onMilestonesChange?: () => void
  onTasksChange?: () => void
}

export function useRealtimeDashboard(options: RealtimeSubscriptionOptions) {
  const { user } = useAuth()
  const channelsRef = useRef<RealtimeChannel[]>([])
  const optionsRef = useRef(options)

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  // Debounce function to prevent excessive re-renders
  const debounce = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(func, delay)
    }
  }, [])

  // Create debounced callbacks
  const debouncedProjectsChange = useCallback(
    debounce(() => optionsRef.current.onProjectsChange?.(), 500),
    []
  )

  const debouncedProposalsChange = useCallback(
    debounce(() => optionsRef.current.onProposalsChange?.(), 500),
    []
  )

  const debouncedInvoicesChange = useCallback(
    debounce(() => optionsRef.current.onInvoicesChange?.(), 500),
    []
  )

  const debouncedTimeEntriesChange = useCallback(
    debounce(() => optionsRef.current.onTimeEntriesChange?.(), 500),
    []
  )

  const debouncedMilestonesChange = useCallback(
    debounce(() => optionsRef.current.onMilestonesChange?.(), 500),
    []
  )

  const debouncedTasksChange = useCallback(
    debounce(() => optionsRef.current.onTasksChange?.(), 500),
    []
  )

  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user) return

    // Clean up existing subscriptions
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel)
    })
    channelsRef.current = []

    // Subscribe to projects changes
    if (options.onProjectsChange) {
      const projectsChannel = supabase
        .channel('projects-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Projects change detected:', payload)
            debouncedProjectsChange()
          }
        )
        .subscribe()

      channelsRef.current.push(projectsChannel)
    }

    // Subscribe to proposals changes
    if (options.onProposalsChange) {
      const proposalsChannel = supabase
        .channel('proposals-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'proposals',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Proposals change detected:', payload)
            debouncedProposalsChange()
          }
        )
        .subscribe()

      channelsRef.current.push(proposalsChannel)
    }

    // Subscribe to invoices changes
    if (options.onInvoicesChange) {
      const invoicesChannel = supabase
        .channel('invoices-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'invoices',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Invoices change detected:', payload)
            debouncedInvoicesChange()
          }
        )
        .subscribe()

      channelsRef.current.push(invoicesChannel)
    }

    // Subscribe to time entries changes
    if (options.onTimeEntriesChange) {
      const timeEntriesChannel = supabase
        .channel('time-entries-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'time_entries',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Time entries change detected:', payload)
            debouncedTimeEntriesChange()
          }
        )
        .subscribe()

      channelsRef.current.push(timeEntriesChannel)
    }

    // Subscribe to project milestones changes
    if (options.onMilestonesChange) {
      const milestonesChannel = supabase
        .channel('milestones-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_milestones'
          },
          (payload) => {
            console.log('Milestones change detected:', payload)
            debouncedMilestonesChange()
          }
        )
        .subscribe()

      channelsRef.current.push(milestonesChannel)
    }

    // Subscribe to tasks changes
    if (options.onTasksChange) {
      const tasksChannel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks'
          },
          (payload) => {
            console.log('Tasks change detected:', payload)
            debouncedTasksChange()
          }
        )
        .subscribe()

      channelsRef.current.push(tasksChannel)
    }

    console.log(`Set up ${channelsRef.current.length} real-time subscriptions`)
  }, [
    user,
    options.onProjectsChange,
    options.onProposalsChange,
    options.onInvoicesChange,
    options.onTimeEntriesChange,
    options.onMilestonesChange,
    options.onTasksChange,
    debouncedProjectsChange,
    debouncedProposalsChange,
    debouncedInvoicesChange,
    debouncedTimeEntriesChange,
    debouncedMilestonesChange,
    debouncedTasksChange
  ])

  // Set up subscriptions when user or options change
  useEffect(() => {
    setupRealtimeSubscriptions()

    // Cleanup function
    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel)
      })
      channelsRef.current = []
    }
  }, [setupRealtimeSubscriptions])

  // Return subscription status
  return {
    isConnected: channelsRef.current.length > 0,
    activeSubscriptions: channelsRef.current.length
  }
}