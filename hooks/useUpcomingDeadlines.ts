'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { UpcomingDeadline, UseUpcomingDeadlinesReturn } from '@/types/dashboard'

export function useUpcomingDeadlines(limit: number = 10): UseUpcomingDeadlinesReturn {
  const { user } = useAuth()
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [overdueTasks, setOverdueTasks] = useState(0)
  const [urgentTasks, setUrgentTasks] = useState(0)
  const fetchingRef = useRef(false)

  const fetchDeadlines = useCallback(async (skipLoading = false) => {
    if (!user || fetchingRef.current) {
      if (!user) setLoading(false)
      return
    }

    try {
      fetchingRef.current = true
      if (!skipLoading) {
        setLoading(true)
      }
      setError(null)

      const now = new Date()
      const urgentThreshold = new Date()
      urgentThreshold.setDate(now.getDate() + 3) // Next 3 days

      // Fetch project milestones and deadlines
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          description,
          due_date,
          status,
          priority,
          progress,
          estimated_hours,
          completed_hours,
          projects!inner(
            id,
            name,
            clients!inner(name)
          )
        `)
        .eq('projects.user_id', user.id)
        .in('status', ['pending', 'in_progress'])
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
        .limit(limit)

      if (milestonesError) throw milestonesError

      // Fetch project deadlines (projects with end dates)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          end_date,
          status,
          priority,
          progress,
          total_hours,
          completed_hours,
          clients!inner(name)
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'in_progress'])
        .not('end_date', 'is', null)
        .order('end_date', { ascending: true })
        .limit(limit)

      if (projectsError) throw projectsError

      // Fetch task deadlines
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          status,
          priority,
          estimated_hours,
          completed_hours,
          projects!inner(
            id,
            name,
            clients!inner(name)
          )
        `)
        .eq('projects.user_id', user.id)
        .in('status', ['pending', 'in_progress'])
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
        .limit(limit)

      if (tasksError) throw tasksError

      const allDeadlines: UpcomingDeadline[] = []

      // Transform milestones to deadlines
      milestonesData?.forEach(milestone => {
        const dueDate = new Date(milestone.due_date)
        const isOverdue = dueDate < now
        const isUrgent = dueDate <= urgentThreshold && !isOverdue

        allDeadlines.push({
          id: `milestone-${milestone.id}`,
          projectId: milestone.projects.id,
          projectName: milestone.projects.name,
          clientName: milestone.projects.clients.name,
          taskName: milestone.title,
          dueDate: milestone.due_date,
          priority: milestone.priority || 'medium',
          progress: milestone.progress || 0,
          status: isOverdue ? 'overdue' : milestone.status,
          estimatedHours: milestone.estimated_hours,
          completedHours: milestone.completed_hours
        })
      })

      // Transform projects to deadlines
      projectsData?.forEach(project => {
        const dueDate = new Date(project.end_date)
        const isOverdue = dueDate < now
        const isUrgent = dueDate <= urgentThreshold && !isOverdue

        allDeadlines.push({
          id: `project-${project.id}`,
          projectId: project.id,
          projectName: project.name,
          clientName: project.clients.name,
          taskName: 'Project completion',
          dueDate: project.end_date,
          priority: project.priority || 'medium',
          progress: project.progress || 0,
          status: isOverdue ? 'overdue' : project.status,
          estimatedHours: project.total_hours,
          completedHours: project.completed_hours
        })
      })

      // Transform tasks to deadlines
      tasksData?.forEach(task => {
        const dueDate = new Date(task.due_date)
        const isOverdue = dueDate < now
        const isUrgent = dueDate <= urgentThreshold && !isOverdue

        allDeadlines.push({
          id: `task-${task.id}`,
          projectId: task.projects.id,
          projectName: task.projects.name,
          clientName: task.projects.clients.name,
          taskName: task.title,
          dueDate: task.due_date,
          priority: task.priority || 'medium',
          progress: task.completed_hours && task.estimated_hours 
            ? Math.round((task.completed_hours / task.estimated_hours) * 100)
            : 0,
          status: isOverdue ? 'overdue' : task.status,
          estimatedHours: task.estimated_hours,
          completedHours: task.completed_hours
        })
      })

      // Sort by due date (earliest first)
      const sortedDeadlines = allDeadlines.sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )

      // Remove duplicates (same project might appear in multiple queries)
      const uniqueDeadlines = sortedDeadlines.filter((deadline, index, self) =>
        index === self.findIndex(d => d.id === deadline.id)
      )

      // Take only the requested limit
      const limitedDeadlines = uniqueDeadlines.slice(0, limit)

      // Calculate overdue and urgent task counts
      const overdueCount = limitedDeadlines.filter(d => d.status === 'overdue').length
      const urgentCount = limitedDeadlines.filter(d => {
        const dueDate = new Date(d.dueDate)
        return dueDate <= urgentThreshold && dueDate >= now
      }).length

      setDeadlines(limitedDeadlines)
      setOverdueTasks(overdueCount)
      setUrgentTasks(urgentCount)

    } catch (err) {
      console.error('Error fetching upcoming deadlines:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch upcoming deadlines'))
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [user, limit])

  const refetch = useCallback(async () => {
    await fetchDeadlines(false)
  }, [fetchDeadlines])

  // Optimized refetch for real-time updates (skip loading state)
  const refetchSilent = useCallback(async () => {
    await fetchDeadlines(true)
  }, [fetchDeadlines])

  useEffect(() => {
    fetchDeadlines(false)
  }, [fetchDeadlines])

  return {
    deadlines,
    loading,
    error,
    refetch,
    refetchSilent,
    overdueTasks,
    urgentTasks
  }
}