'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import * as proposalService from '@/lib/supabase/proposals'
import type { 
  Proposal, 
  ProposalSection, 
  ProposalItem,
  ProposalFilters,
  ProposalPagination,
  ProposalSorting,
  ProposalInsert,
  ProposalSectionInsert,
  ProposalItemInsert,
  ProposalUpdate,
  ProposalSectionUpdate,
  ProposalItemUpdate
} from '@/types/proposals'

interface UseProposalOperationsReturn {
  // Fetch operations
  fetchProposals: (
    filters?: ProposalFilters,
    pagination?: ProposalPagination,
    sorting?: ProposalSorting
  ) => Promise<{
    proposals: Proposal[];
    count: number;
    hasMore: boolean;
  }>;
  fetchProposal: (id: string) => Promise<Proposal>;
  searchProposals: (query: string, limit?: number) => Promise<Proposal[]>;
  getProposalStats: () => Promise<{
    counts: {
      total: number;
      draft: number;
      sent: number;
      viewed: number;
      accepted: number;
      rejected: number;
      expired: number;
    };
    conversionRate: number;
    totalAcceptedValue: number;
  }>;
  
  // Create operations
  createProposal: (data: ProposalInsert) => Promise<Proposal>;
  addProposalSection: (data: ProposalSectionInsert) => Promise<ProposalSection>;
  addProposalItem: (data: ProposalItemInsert) => Promise<ProposalItem>;
  
  // Update operations
  updateProposal: (id: string, data: ProposalUpdate) => Promise<Proposal>;
  updateProposalSection: (id: string, data: ProposalSectionUpdate) => Promise<ProposalSection>;
  updateProposalItem: (id: string, data: ProposalItemUpdate) => Promise<ProposalItem>;
  
  // Delete operations
  deleteProposalSection: (id: string) => Promise<void>;
  deleteProposalItem: (id: string) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;
  
  // Status operations
  sendProposal: (id: string) => Promise<Proposal>;
  markProposalAsAccepted: (id: string) => Promise<Proposal>;
  markProposalAsRejected: (id: string) => Promise<Proposal>;
  checkForExpiredProposals: () => Promise<number>;
  
  // Real-time subscriptions
  subscribeToProposal: (id: string, callback: () => void) => () => void;
  subscribeToAllProposals: (callback: () => void) => () => void;
  
  // State
  loading: boolean;
  error: Error | null;
}

export function useProposalOperations(): UseProposalOperationsReturn {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Helper to handle errors consistently
  const handleError = useCallback((error: any, message: string) => {
    console.error(message, error)
    const errorObj = error instanceof Error ? error : new Error(message)
    setError(errorObj)
    throw errorObj
  }, [])

  // Fetch operations
  const fetchProposals = useCallback(async (
    filters?: ProposalFilters,
    pagination?: ProposalPagination,
    sorting?: ProposalSorting
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to fetch proposals')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.fetchProposals(user.id, filters, pagination, sorting)
    } catch (error) {
      return handleError(error, 'Failed to fetch proposals')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const fetchProposal = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to fetch a proposal')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.fetchProposal(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to fetch proposal')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const searchProposals = useCallback(async (query: string, limit?: number) => {
    if (!user) {
      throw new Error('User must be authenticated to search proposals')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.searchProposals(user.id, query, limit)
    } catch (error) {
      return handleError(error, 'Failed to search proposals')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const getProposalStats = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to get proposal stats')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.getProposalStats(user.id)
    } catch (error) {
      return handleError(error, 'Failed to get proposal stats')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  // Create operations
  const createProposal = useCallback(async (data: ProposalInsert) => {
    if (!user) {
      throw new Error('User must be authenticated to create a proposal')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.createProposal(user.id, data)
    } catch (error) {
      return handleError(error, 'Failed to create proposal')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const addProposalSection = useCallback(async (data: ProposalSectionInsert) => {
    if (!user) {
      throw new Error('User must be authenticated to add a proposal section')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.addProposalSection(user.id, data)
    } catch (error) {
      return handleError(error, 'Failed to add proposal section')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const addProposalItem = useCallback(async (data: ProposalItemInsert) => {
    if (!user) {
      throw new Error('User must be authenticated to add a proposal item')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.addProposalItem(user.id, data)
    } catch (error) {
      return handleError(error, 'Failed to add proposal item')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  // Update operations
  const updateProposal = useCallback(async (id: string, data: ProposalUpdate) => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.updateProposal(user.id, id, data)
    } catch (error) {
      return handleError(error, 'Failed to update proposal')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const updateProposalSection = useCallback(async (id: string, data: ProposalSectionUpdate) => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal section')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.updateProposalSection(user.id, id, data)
    } catch (error) {
      return handleError(error, 'Failed to update proposal section')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const updateProposalItem = useCallback(async (id: string, data: ProposalItemUpdate) => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal item')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.updateProposalItem(user.id, id, data)
    } catch (error) {
      return handleError(error, 'Failed to update proposal item')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  // Delete operations
  const deleteProposalSection = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal section')
    }

    try {
      setLoading(true)
      setError(null)
      await proposalService.deleteProposalSection(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to delete proposal section')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const deleteProposalItem = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal item')
    }

    try {
      setLoading(true)
      setError(null)
      await proposalService.deleteProposalItem(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to delete proposal item')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const deleteProposal = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal')
    }

    try {
      setLoading(true)
      setError(null)
      await proposalService.deleteProposal(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to delete proposal')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  // Status operations
  const sendProposal = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to send a proposal')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.sendProposal(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to send proposal')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const markProposalAsAccepted = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to mark a proposal as accepted')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.markProposalAsAccepted(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to mark proposal as accepted')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const markProposalAsRejected = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User must be authenticated to mark a proposal as rejected')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.markProposalAsRejected(user.id, id)
    } catch (error) {
      return handleError(error, 'Failed to mark proposal as rejected')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  const checkForExpiredProposals = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to check for expired proposals')
    }

    try {
      setLoading(true)
      setError(null)
      return await proposalService.checkForExpiredProposals(user.id)
    } catch (error) {
      return handleError(error, 'Failed to check for expired proposals')
    } finally {
      setLoading(false)
    }
  }, [user, handleError])

  // Real-time subscriptions
  const subscribeToProposal = useCallback((id: string, callback: () => void) => {
    return proposalService.subscribeToProposal(id, callback)
  }, [])

  const subscribeToAllProposals = useCallback((callback: () => void) => {
    if (!user) {
      throw new Error('User must be authenticated to subscribe to proposals')
    }
    return proposalService.subscribeToAllProposals(user.id, callback)
  }, [user])

  return {
    // Fetch operations
    fetchProposals,
    fetchProposal,
    searchProposals,
    getProposalStats,
    
    // Create operations
    createProposal,
    addProposalSection,
    addProposalItem,
    
    // Update operations
    updateProposal,
    updateProposalSection,
    updateProposalItem,
    
    // Delete operations
    deleteProposalSection,
    deleteProposalItem,
    deleteProposal,
    
    // Status operations
    sendProposal,
    markProposalAsAccepted,
    markProposalAsRejected,
    checkForExpiredProposals,
    
    // Real-time subscriptions
    subscribeToProposal,
    subscribeToAllProposals,
    
    // State
    loading,
    error
  }
}