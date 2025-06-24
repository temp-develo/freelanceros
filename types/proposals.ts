import { Database } from '@/lib/supabase/database-types'

// Type definitions for proposals
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

export interface Proposal {
  id: string
  userId: string
  clientId: string
  clientName: string
  title: string
  description: string | null
  status: ProposalStatus
  amount: number
  currency: string
  validUntil: string | null
  sentAt: string | null
  viewedAt: string | null
  respondedAt: string | null
  createdAt: string
  updatedAt: string
  sections?: ProposalSection[]
  items?: ProposalItem[]
}

export interface ProposalSection {
  id: string
  proposalId: string
  title: string
  content: string | null
  orderPosition: number
  createdAt: string
  updatedAt: string
}

export interface ProposalItem {
  id: string
  proposalId: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  orderPosition: number
  createdAt: string
  updatedAt: string
}

// Database row types from Supabase
export type ProposalRow = Database['public']['Tables']['proposals']['Row']
export type ProposalSectionRow = Database['public']['Tables']['proposal_sections']['Row']
export type ProposalItemRow = Database['public']['Tables']['proposal_items']['Row']

// Insert types for creating new records
export type ProposalInsert = Database['public']['Tables']['proposals']['Insert']
export type ProposalSectionInsert = Database['public']['Tables']['proposal_sections']['Insert']
export type ProposalItemInsert = Database['public']['Tables']['proposal_items']['Insert']

// Update types for updating existing records
export type ProposalUpdate = Database['public']['Tables']['proposals']['Update']
export type ProposalSectionUpdate = Database['public']['Tables']['proposal_sections']['Update']
export type ProposalItemUpdate = Database['public']['Tables']['proposal_items']['Update']

// Filter and query types
export interface ProposalFilters {
  status?: ProposalStatus | ProposalStatus[]
  clientId?: string
  search?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface ProposalPagination {
  page: number
  pageSize: number
}

export interface ProposalSorting {
  column: string
  direction: 'asc' | 'desc'
}

// Hook return types
export interface UseProposalsReturn {
  proposals: Proposal[]
  loading: boolean
  error: Error | null
  totalCount: number
  hasMore: boolean
  filters: ProposalFilters
  pagination: ProposalPagination
  sorting: ProposalSorting
  setFilters: (filters: ProposalFilters) => void
  setPagination: (pagination: ProposalPagination) => void
  setSorting: (sorting: ProposalSorting) => void
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
}

export interface UseProposalReturn {
  proposal: Proposal | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export interface UseCreateProposalReturn {
  createProposal: (data: ProposalInsert) => Promise<Proposal>
  addSection: (data: ProposalSectionInsert) => Promise<ProposalSection>
  addItem: (data: ProposalItemInsert) => Promise<ProposalItem>
  loading: boolean
  error: Error | null
}

export interface UseUpdateProposalReturn {
  updateProposal: (id: string, data: ProposalUpdate) => Promise<Proposal>
  updateSection: (id: string, data: ProposalSectionUpdate) => Promise<ProposalSection>
  updateItem: (id: string, data: ProposalItemUpdate) => Promise<ProposalItem>
  deleteSection: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  sendProposal: (id: string) => Promise<Proposal>
  markAsAccepted: (id: string) => Promise<Proposal>
  markAsRejected: (id: string) => Promise<Proposal>
  loading: boolean
  error: Error | null
}

export interface UseDeleteProposalReturn {
  deleteProposal: (id: string) => Promise<void>
  loading: boolean
  error: Error | null
}