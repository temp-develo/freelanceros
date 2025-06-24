'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { 
  Proposal, 
  ProposalFilters, 
  ProposalPagination, 
  ProposalSorting,
  UseProposalsReturn,
  ProposalRow
} from '@/types/proposals'

export function useProposals(
  initialFilters: ProposalFilters = {},
  initialPagination: ProposalPagination = { page: 1, pageSize: 10 },
  initialSorting: ProposalSorting = { column: 'created_at', direction: 'desc' }
): UseProposalsReturn {
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<ProposalFilters>(initialFilters)
  const [pagination, setPagination] = useState<ProposalPagination>(initialPagination)
  const [sorting, setSorting] = useState<ProposalSorting>(initialSorting)
  const fetchingRef = useRef(false)

  const fetchProposals = useCallback(async (isLoadMore = false) => {
    if (!user || fetchingRef.current) {
      if (!user) setLoading(false)
      return
    }

    try {
      fetchingRef.current = true
      if (!isLoadMore) {
        setLoading(true)
      }
      setError(null)

      // Calculate pagination range
      const from = isLoadMore 
        ? proposals.length 
        : (pagination.page - 1) * pagination.pageSize
      const to = isLoadMore 
        ? from + pagination.pageSize - 1 
        : from + pagination.pageSize - 1

      // Start building the query
      let query = supabase
        .from('proposals')
        .select(`
          *,
          clients!inner(id, name)
        `, { count: 'exact' })
        .eq('user_id', user.id)

      // Apply filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status)
        } else {
          query = query.eq('status', filters.status)
        }
      }

      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount)
      }

      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount)
      }

      // Apply sorting
      query = query.order(sorting.column, { ascending: sorting.direction === 'asc' })

      // Apply pagination
      query = query.range(from, to)

      // Execute the query
      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      // Transform the data
      const transformedProposals = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        clientId: row.client_id,
        clientName: row.clients.name,
        title: row.title,
        description: row.description,
        status: row.status,
        amount: row.amount,
        currency: row.currency,
        validUntil: row.valid_until,
        sentAt: row.sent_at,
        viewedAt: row.viewed_at,
        respondedAt: row.responded_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))

      // Update state
      if (isLoadMore) {
        setProposals(prev => [...prev, ...transformedProposals])
      } else {
        setProposals(transformedProposals)
      }

      if (count !== null) {
        setTotalCount(count)
        setHasMore(from + transformedProposals.length < count)
      }

    } catch (err) {
      console.error('Error fetching proposals:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch proposals'))
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [user, filters, pagination, sorting, proposals.length])

  // Fetch proposals when dependencies change
  useEffect(() => {
    if (user) {
      fetchProposals(false)
    }
  }, [user, filters, pagination.page, pagination.pageSize, sorting, fetchProposals])

  // Load more proposals
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchProposals(true)
    }
  }, [hasMore, loading, fetchProposals])

  // Refetch proposals
  const refetch = useCallback(async () => {
    await fetchProposals(false)
  }, [fetchProposals])

  return {
    proposals,
    loading,
    error,
    totalCount,
    hasMore,
    filters,
    pagination,
    sorting,
    setFilters,
    setPagination,
    setSorting,
    refetch,
    loadMore
  }
}