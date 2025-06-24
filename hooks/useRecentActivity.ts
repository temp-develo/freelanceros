'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { RecentActivity, UseRecentActivityReturn } from '@/types/dashboard'

export function useRecentActivity(limit: number = 10): UseRecentActivityReturn {
  const { user } = useAuth()
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchActivities = useCallback(async (isLoadMore = false) => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      if (!isLoadMore) {
        setLoading(true)
        setError(null)
      }

      const currentOffset = isLoadMore ? offset : 0
      const allActivities: RecentActivity[] = []

      // Fetch recent proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`
          id,
          title,
          status,
          amount,
          currency,
          sent_at,
          created_at,
          updated_at,
          clients!inner(name)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit)
        .range(currentOffset, currentOffset + limit - 1)

      if (proposalsError) throw proposalsError

      // Transform proposals to activities
      proposalsData?.forEach(proposal => {
        if (proposal.sent_at) {
          allActivities.push({
            id: `proposal-${proposal.id}`,
            type: 'proposal_sent',
            title: `Proposal sent to ${proposal.clients.name}`,
            description: `${proposal.title} - $${proposal.amount.toLocaleString()} ${proposal.currency}`,
            timestamp: proposal.sent_at,
            metadata: {
              proposalId: proposal.id,
              amount: proposal.amount
            }
          })
        }
      })

      // Fetch recent project updates
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          progress,
          updated_at,
          clients!inner(name)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit)
        .range(currentOffset, currentOffset + limit - 1)

      if (projectsError) throw projectsError

      // Transform projects to activities
      projectsData?.forEach(project => {
        if (project.status === 'completed') {
          allActivities.push({
            id: `project-completed-${project.id}`,
            type: 'project_completed',
            title: `Project completed for ${project.clients.name}`,
            description: `${project.name} - 100% complete`,
            timestamp: project.updated_at,
            metadata: {
              projectId: project.id
            }
          })
        } else if (project.progress >= 50) {
          allActivities.push({
            id: `milestone-${project.id}`,
            type: 'milestone_reached',
            title: `Milestone reached in ${project.name}`,
            description: `${project.progress}% complete for ${project.clients.name}`,
            timestamp: project.updated_at,
            metadata: {
              projectId: project.id
            }
          })
        }
      })

      // Fetch recent payments
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          currency,
          paid_at,
          clients!inner(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .not('paid_at', 'is', null)
        .order('paid_at', { ascending: false })
        .limit(limit)
        .range(currentOffset, currentOffset + limit - 1)

      if (invoicesError) throw invoicesError

      // Transform payments to activities
      invoicesData?.forEach(invoice => {
        allActivities.push({
          id: `payment-${invoice.id}`,
          type: 'payment_received',
          title: `Payment received from ${invoice.clients.name}`,
          description: `Invoice ${invoice.invoice_number} - $${invoice.amount.toLocaleString()} ${invoice.currency}`,
          timestamp: invoice.paid_at!,
          metadata: {
            invoiceId: invoice.id,
            amount: invoice.amount
          }
        })
      })

      // Fetch recent invoices sent
      const { data: sentInvoicesData, error: sentInvoicesError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          currency,
          sent_at,
          clients!inner(name)
        `)
        .eq('user_id', user.id)
        .in('status', ['sent', 'overdue'])
        .not('sent_at', 'is', null)
        .order('sent_at', { ascending: false })
        .limit(limit)
        .range(currentOffset, currentOffset + limit - 1)

      if (sentInvoicesError) throw sentInvoicesError

      // Transform sent invoices to activities
      sentInvoicesData?.forEach(invoice => {
        allActivities.push({
          id: `invoice-sent-${invoice.id}`,
          type: 'invoice_sent',
          title: `Invoice sent to ${invoice.clients.name}`,
          description: `Invoice ${invoice.invoice_number} - $${invoice.amount.toLocaleString()} ${invoice.currency}`,
          timestamp: invoice.sent_at!,
          metadata: {
            invoiceId: invoice.id,
            amount: invoice.amount
          }
        })
      })

      // Sort all activities by timestamp (most recent first)
      const sortedActivities = allActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      // Take only the requested limit
      const limitedActivities = sortedActivities.slice(0, limit)

      if (isLoadMore) {
        setActivities(prev => [...prev, ...limitedActivities])
        setOffset(prev => prev + limit)
      } else {
        setActivities(limitedActivities)
        setOffset(limit)
      }

      // Check if there are more activities to load
      setHasMore(limitedActivities.length === limit)

    } catch (err) {
      console.error('Error fetching recent activity:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch recent activity'))
    } finally {
      setLoading(false)
    }
  }, [user, limit, offset])

  const refetch = useCallback(async () => {
    setOffset(0)
    await fetchActivities(false)
  }, [fetchActivities])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchActivities(true)
    }
  }, [fetchActivities, loading, hasMore])

  useEffect(() => {
    fetchActivities(false)
  }, [user, limit])

  return {
    activities,
    loading,
    error,
    refetch,
    hasMore,
    loadMore
  }
}