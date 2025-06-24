import { supabase } from '@/lib/supabase/client'
import type { 
  ProposalFilters, 
  ProposalPagination, 
  ProposalSorting 
} from '@/types/proposals'

// Build a query for proposals with filters, pagination, and sorting
export function buildProposalQuery(
  userId: string,
  filters: ProposalFilters = {},
  pagination: ProposalPagination = { page: 1, pageSize: 10 },
  sorting: ProposalSorting = { column: 'created_at', direction: 'desc' }
) {
  // Calculate pagination range
  const from = (pagination.page - 1) * pagination.pageSize
  const to = from + pagination.pageSize - 1

  // Start building the query
  let query = supabase
    .from('proposals')
    .select(`
      *,
      clients!inner(id, name)
    `, { count: 'exact' })
    .eq('user_id', userId)

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

  return query
}

// Build a query for a single proposal with its sections and items
export function buildSingleProposalQuery(userId: string, proposalId: string) {
  return supabase
    .from('proposals')
    .select(`
      *,
      clients!inner(id, name)
    `)
    .eq('id', proposalId)
    .eq('user_id', userId)
    .single()
}

// Build a query for proposal sections
export function buildProposalSectionsQuery(proposalId: string) {
  return supabase
    .from('proposal_sections')
    .select('*')
    .eq('proposal_id', proposalId)
    .order('order_position', { ascending: true })
}

// Build a query for proposal items
export function buildProposalItemsQuery(proposalId: string) {
  return supabase
    .from('proposal_items')
    .select('*')
    .eq('proposal_id', proposalId)
    .order('order_position', { ascending: true })
}

// Build a query for proposal statistics
export function buildProposalStatsQuery(userId: string) {
  return {
    statusCounts: supabase
      .from('proposals')
      .select('status, count')
      .eq('user_id', userId)
      .group('status'),
    
    acceptedAmount: supabase
      .from('proposals')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'accepted')
  }
}

// Build a query to check for expired proposals
export function buildExpiredProposalsQuery(userId: string) {
  const now = new Date().toISOString()
  
  return supabase
    .from('proposals')
    .select('id')
    .eq('user_id', userId)
    .in('status', ['sent', 'viewed'])
    .lt('valid_until', now)
}

// Build a search query for proposals
export function buildProposalSearchQuery(userId: string, query: string, limit: number = 10) {
  return supabase
    .from('proposals')
    .select(`
      *,
      clients!inner(id, name)
    `)
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,clients.name.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit)
}