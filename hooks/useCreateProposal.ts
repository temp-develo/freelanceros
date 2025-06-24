'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { 
  Proposal, 
  ProposalSection, 
  ProposalItem,
  ProposalInsert,
  ProposalSectionInsert,
  ProposalItemInsert,
  UseCreateProposalReturn
} from '@/types/proposals'

export function useCreateProposal(): UseCreateProposalReturn {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createProposal = useCallback(async (data: ProposalInsert): Promise<Proposal> => {
    if (!user) {
      throw new Error('User must be authenticated to create a proposal')
    }

    try {
      setLoading(true)
      setError(null)

      // Ensure user_id is set
      const proposalData = {
        ...data,
        user_id: user.id
      }

      // Insert the proposal
      const { data: insertedProposal, error: insertError } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select(`
          *,
          clients!inner(id, name)
        `)
        .single()

      if (insertError) throw insertError

      // Transform the response
      const proposal: Proposal = {
        id: insertedProposal.id,
        userId: insertedProposal.user_id,
        clientId: insertedProposal.client_id,
        clientName: insertedProposal.clients.name,
        title: insertedProposal.title,
        description: insertedProposal.description,
        status: insertedProposal.status,
        amount: insertedProposal.amount,
        currency: insertedProposal.currency,
        validUntil: insertedProposal.valid_until,
        sentAt: insertedProposal.sent_at,
        viewedAt: insertedProposal.viewed_at,
        respondedAt: insertedProposal.responded_at,
        createdAt: insertedProposal.created_at,
        updatedAt: insertedProposal.updated_at,
        sections: [],
        items: []
      }

      return proposal
    } catch (err) {
      console.error('Error creating proposal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create proposal'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const addSection = useCallback(async (data: ProposalSectionInsert): Promise<ProposalSection> => {
    if (!user) {
      throw new Error('User must be authenticated to add a proposal section')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the proposal
      const { data: proposalCheck, error: checkError } = await supabase
        .from('proposals')
        .select('id')
        .eq('id', data.proposal_id)
        .eq('user_id', user.id)
        .single()

      if (checkError || !proposalCheck) {
        throw new Error('Proposal not found or you do not have permission to modify it')
      }

      // Insert the section
      const { data: insertedSection, error: insertError } = await supabase
        .from('proposal_sections')
        .insert(data)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Transform the response
      const section: ProposalSection = {
        id: insertedSection.id,
        proposalId: insertedSection.proposal_id,
        title: insertedSection.title,
        content: insertedSection.content,
        orderPosition: insertedSection.order_position,
        createdAt: insertedSection.created_at,
        updatedAt: insertedSection.updated_at
      }

      return section
    } catch (err) {
      console.error('Error adding proposal section:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add proposal section'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const addItem = useCallback(async (data: ProposalItemInsert): Promise<ProposalItem> => {
    if (!user) {
      throw new Error('User must be authenticated to add a proposal item')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the proposal
      const { data: proposalCheck, error: checkError } = await supabase
        .from('proposals')
        .select('id')
        .eq('id', data.proposal_id)
        .eq('user_id', user.id)
        .single()

      if (checkError || !proposalCheck) {
        throw new Error('Proposal not found or you do not have permission to modify it')
      }

      // Calculate amount if not provided
      const itemData = {
        ...data,
        amount: data.amount || (data.quantity * data.unit_price)
      }

      // Insert the item
      const { data: insertedItem, error: insertError } = await supabase
        .from('proposal_items')
        .insert(itemData)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Update the proposal total amount
      await updateProposalAmount(data.proposal_id)

      // Transform the response
      const item: ProposalItem = {
        id: insertedItem.id,
        proposalId: insertedItem.proposal_id,
        description: insertedItem.description,
        quantity: insertedItem.quantity,
        unitPrice: insertedItem.unit_price,
        amount: insertedItem.amount,
        orderPosition: insertedItem.order_position,
        createdAt: insertedItem.created_at,
        updatedAt: insertedItem.updated_at
      }

      return item
    } catch (err) {
      console.error('Error adding proposal item:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add proposal item'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  // Helper function to update proposal amount based on items
  const updateProposalAmount = async (proposalId: string) => {
    try {
      // Calculate total from items
      const { data: items, error: itemsError } = await supabase
        .from('proposal_items')
        .select('amount')
        .eq('proposal_id', proposalId)

      if (itemsError) throw itemsError

      const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0)

      // Update proposal amount
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ amount: totalAmount })
        .eq('id', proposalId)
        .eq('user_id', user?.id)

      if (updateError) throw updateError
    } catch (err) {
      console.error('Error updating proposal amount:', err)
    }
  }

  return {
    createProposal,
    addSection,
    addItem,
    loading,
    error
  }
}