'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { 
  Proposal, 
  ProposalSection, 
  ProposalItem,
  UseProposalReturn
} from '@/types/proposals'

export function useProposal(proposalId: string | null): UseProposalReturn {
  const { user } = useAuth()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProposal = useCallback(async () => {
    if (!user || !proposalId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch the proposal with client information
      const { data: proposalData, error: proposalError } = await supabase
        .from('proposals')
        .select(`
          *,
          clients!inner(id, name)
        `)
        .eq('id', proposalId)
        .eq('user_id', user.id)
        .single()

      if (proposalError) throw proposalError

      // Fetch proposal sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('proposal_sections')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('order_position', { ascending: true })

      if (sectionsError) throw sectionsError

      // Fetch proposal items
      const { data: itemsData, error: itemsError } = await supabase
        .from('proposal_items')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('order_position', { ascending: true })

      if (itemsError) throw itemsError

      // Transform the data
      const transformedProposal: Proposal = {
        id: proposalData.id,
        userId: proposalData.user_id,
        clientId: proposalData.client_id,
        clientName: proposalData.clients.name,
        title: proposalData.title,
        description: proposalData.description,
        status: proposalData.status,
        amount: proposalData.amount,
        currency: proposalData.currency,
        validUntil: proposalData.valid_until,
        sentAt: proposalData.sent_at,
        viewedAt: proposalData.viewed_at,
        respondedAt: proposalData.responded_at,
        createdAt: proposalData.created_at,
        updatedAt: proposalData.updated_at,
        sections: sectionsData.map(section => ({
          id: section.id,
          proposalId: section.proposal_id,
          title: section.title,
          content: section.content,
          orderPosition: section.order_position,
          createdAt: section.created_at,
          updatedAt: section.updated_at
        })),
        items: itemsData.map(item => ({
          id: item.id,
          proposalId: item.proposal_id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          amount: item.amount,
          orderPosition: item.order_position,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }))
      }

      setProposal(transformedProposal)
    } catch (err) {
      console.error('Error fetching proposal:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch proposal'))
    } finally {
      setLoading(false)
    }
  }, [user, proposalId])

  // Fetch proposal when dependencies change
  useEffect(() => {
    fetchProposal()
  }, [fetchProposal])

  // Set up real-time subscription for proposal updates
  useEffect(() => {
    if (!user || !proposalId) return

    // Subscribe to proposal changes
    const proposalChannel = supabase
      .channel(`proposal-${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `id=eq.${proposalId}`
        },
        () => {
          fetchProposal()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposal_sections',
          filter: `proposal_id=eq.${proposalId}`
        },
        () => {
          fetchProposal()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposal_items',
          filter: `proposal_id=eq.${proposalId}`
        },
        () => {
          fetchProposal()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(proposalChannel)
    }
  }, [user, proposalId, fetchProposal])

  return {
    proposal,
    loading,
    error,
    refetch: fetchProposal
  }
}