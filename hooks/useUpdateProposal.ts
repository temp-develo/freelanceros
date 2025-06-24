'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { 
  Proposal, 
  ProposalSection, 
  ProposalItem,
  ProposalUpdate,
  ProposalSectionUpdate,
  ProposalItemUpdate,
  UseUpdateProposalReturn
} from '@/types/proposals'

export function useUpdateProposal(): UseUpdateProposalReturn {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateProposal = useCallback(async (id: string, data: ProposalUpdate): Promise<Proposal> => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal')
    }

    try {
      setLoading(true)
      setError(null)

      // Update the proposal
      const { data: updatedProposal, error: updateError } = await supabase
        .from('proposals')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients!inner(id, name)
        `)
        .single()

      if (updateError) throw updateError

      // Transform the response
      const proposal: Proposal = {
        id: updatedProposal.id,
        userId: updatedProposal.user_id,
        clientId: updatedProposal.client_id,
        clientName: updatedProposal.clients.name,
        title: updatedProposal.title,
        description: updatedProposal.description,
        status: updatedProposal.status,
        amount: updatedProposal.amount,
        currency: updatedProposal.currency,
        validUntil: updatedProposal.valid_until,
        sentAt: updatedProposal.sent_at,
        viewedAt: updatedProposal.viewed_at,
        respondedAt: updatedProposal.responded_at,
        createdAt: updatedProposal.created_at,
        updatedAt: updatedProposal.updated_at
      }

      return proposal
    } catch (err) {
      console.error('Error updating proposal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update proposal'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateSection = useCallback(async (id: string, data: ProposalSectionUpdate): Promise<ProposalSection> => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal section')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the section's proposal
      const { data: sectionCheck, error: checkError } = await supabase
        .from('proposal_sections')
        .select(`
          proposal_id,
          proposals!inner(user_id)
        `)
        .eq('id', id)
        .single()

      if (checkError || !sectionCheck || sectionCheck.proposals.user_id !== user.id) {
        throw new Error('Section not found or you do not have permission to modify it')
      }

      // Update the section
      const { data: updatedSection, error: updateError } = await supabase
        .from('proposal_sections')
        .update(data)
        .eq('id', id)
        .select('*')
        .single()

      if (updateError) throw updateError

      // Transform the response
      const section: ProposalSection = {
        id: updatedSection.id,
        proposalId: updatedSection.proposal_id,
        title: updatedSection.title,
        content: updatedSection.content,
        orderPosition: updatedSection.order_position,
        createdAt: updatedSection.created_at,
        updatedAt: updatedSection.updated_at
      }

      return section
    } catch (err) {
      console.error('Error updating proposal section:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update proposal section'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateItem = useCallback(async (id: string, data: ProposalItemUpdate): Promise<ProposalItem> => {
    if (!user) {
      throw new Error('User must be authenticated to update a proposal item')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the item's proposal
      const { data: itemCheck, error: checkError } = await supabase
        .from('proposal_items')
        .select(`
          proposal_id,
          proposals!inner(user_id)
        `)
        .eq('id', id)
        .single()

      if (checkError || !itemCheck || itemCheck.proposals.user_id !== user.id) {
        throw new Error('Item not found or you do not have permission to modify it')
      }

      // Calculate amount if quantity or unit_price is updated
      let itemData = { ...data }
      if ((data.quantity !== undefined || data.unit_price !== undefined) && !data.amount) {
        // Get current values for any missing fields
        const { data: currentItem } = await supabase
          .from('proposal_items')
          .select('quantity, unit_price')
          .eq('id', id)
          .single()

        const quantity = data.quantity !== undefined ? data.quantity : currentItem.quantity
        const unitPrice = data.unit_price !== undefined ? data.unit_price : currentItem.unit_price
        
        itemData.amount = quantity * unitPrice
      }

      // Update the item
      const { data: updatedItem, error: updateError } = await supabase
        .from('proposal_items')
        .update(itemData)
        .eq('id', id)
        .select('*')
        .single()

      if (updateError) throw updateError

      // Update the proposal total amount
      await updateProposalAmount(itemCheck.proposal_id)

      // Transform the response
      const item: ProposalItem = {
        id: updatedItem.id,
        proposalId: updatedItem.proposal_id,
        description: updatedItem.description,
        quantity: updatedItem.quantity,
        unitPrice: updatedItem.unit_price,
        amount: updatedItem.amount,
        orderPosition: updatedItem.order_position,
        createdAt: updatedItem.created_at,
        updatedAt: updatedItem.updated_at
      }

      return item
    } catch (err) {
      console.error('Error updating proposal item:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update proposal item'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteSection = useCallback(async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal section')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the section's proposal
      const { data: sectionCheck, error: checkError } = await supabase
        .from('proposal_sections')
        .select(`
          proposal_id,
          proposals!inner(user_id)
        `)
        .eq('id', id)
        .single()

      if (checkError || !sectionCheck || sectionCheck.proposals.user_id !== user.id) {
        throw new Error('Section not found or you do not have permission to delete it')
      }

      // Delete the section
      const { error: deleteError } = await supabase
        .from('proposal_sections')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
    } catch (err) {
      console.error('Error deleting proposal section:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete proposal section'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal item')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the item's proposal and get proposal_id
      const { data: itemCheck, error: checkError } = await supabase
        .from('proposal_items')
        .select(`
          proposal_id,
          proposals!inner(user_id)
        `)
        .eq('id', id)
        .single()

      if (checkError || !itemCheck || itemCheck.proposals.user_id !== user.id) {
        throw new Error('Item not found or you do not have permission to delete it')
      }

      const proposalId = itemCheck.proposal_id

      // Delete the item
      const { error: deleteError } = await supabase
        .from('proposal_items')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Update the proposal total amount
      await updateProposalAmount(proposalId)
    } catch (err) {
      console.error('Error deleting proposal item:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete proposal item'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const sendProposal = useCallback(async (id: string): Promise<Proposal> => {
    if (!user) {
      throw new Error('User must be authenticated to send a proposal')
    }

    try {
      setLoading(true)
      setError(null)

      // Update the proposal status to 'sent' and set sent_at timestamp
      const { data: updatedProposal, error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients!inner(id, name)
        `)
        .single()

      if (updateError) throw updateError

      // Transform the response
      const proposal: Proposal = {
        id: updatedProposal.id,
        userId: updatedProposal.user_id,
        clientId: updatedProposal.client_id,
        clientName: updatedProposal.clients.name,
        title: updatedProposal.title,
        description: updatedProposal.description,
        status: updatedProposal.status,
        amount: updatedProposal.amount,
        currency: updatedProposal.currency,
        validUntil: updatedProposal.valid_until,
        sentAt: updatedProposal.sent_at,
        viewedAt: updatedProposal.viewed_at,
        respondedAt: updatedProposal.responded_at,
        createdAt: updatedProposal.created_at,
        updatedAt: updatedProposal.updated_at
      }

      return proposal
    } catch (err) {
      console.error('Error sending proposal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send proposal'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const markAsAccepted = useCallback(async (id: string): Promise<Proposal> => {
    if (!user) {
      throw new Error('User must be authenticated to mark a proposal as accepted')
    }

    try {
      setLoading(true)
      setError(null)

      // Update the proposal status to 'accepted' and set responded_at timestamp
      const { data: updatedProposal, error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients!inner(id, name)
        `)
        .single()

      if (updateError) throw updateError

      // Transform the response
      const proposal: Proposal = {
        id: updatedProposal.id,
        userId: updatedProposal.user_id,
        clientId: updatedProposal.client_id,
        clientName: updatedProposal.clients.name,
        title: updatedProposal.title,
        description: updatedProposal.description,
        status: updatedProposal.status,
        amount: updatedProposal.amount,
        currency: updatedProposal.currency,
        validUntil: updatedProposal.valid_until,
        sentAt: updatedProposal.sent_at,
        viewedAt: updatedProposal.viewed_at,
        respondedAt: updatedProposal.responded_at,
        createdAt: updatedProposal.created_at,
        updatedAt: updatedProposal.updated_at
      }

      return proposal
    } catch (err) {
      console.error('Error marking proposal as accepted:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark proposal as accepted'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const markAsRejected = useCallback(async (id: string): Promise<Proposal> => {
    if (!user) {
      throw new Error('User must be authenticated to mark a proposal as rejected')
    }

    try {
      setLoading(true)
      setError(null)

      // Update the proposal status to 'rejected' and set responded_at timestamp
      const { data: updatedProposal, error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          clients!inner(id, name)
        `)
        .single()

      if (updateError) throw updateError

      // Transform the response
      const proposal: Proposal = {
        id: updatedProposal.id,
        userId: updatedProposal.user_id,
        clientId: updatedProposal.client_id,
        clientName: updatedProposal.clients.name,
        title: updatedProposal.title,
        description: updatedProposal.description,
        status: updatedProposal.status,
        amount: updatedProposal.amount,
        currency: updatedProposal.currency,
        validUntil: updatedProposal.valid_until,
        sentAt: updatedProposal.sent_at,
        viewedAt: updatedProposal.viewed_at,
        respondedAt: updatedProposal.responded_at,
        createdAt: updatedProposal.created_at,
        updatedAt: updatedProposal.updated_at
      }

      return proposal
    } catch (err) {
      console.error('Error marking proposal as rejected:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark proposal as rejected'
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
    updateProposal,
    updateSection,
    updateItem,
    deleteSection,
    deleteItem,
    sendProposal,
    markAsAccepted,
    markAsRejected,
    loading,
    error
  }
}