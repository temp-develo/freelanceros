import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Set up real-time subscription for a specific proposal
export function subscribeToProposalChanges(
  proposalId: string,
  onProposalChange?: () => void,
  onSectionChange?: () => void,
  onItemChange?: () => void
): () => void {
  const channels: RealtimeChannel[] = []

  // Subscribe to proposal changes
  if (onProposalChange) {
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
        () => onProposalChange()
      )
      .subscribe()
    
    channels.push(proposalChannel)
  }

  // Subscribe to section changes
  if (onSectionChange) {
    const sectionChannel = supabase
      .channel(`proposal-sections-${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposal_sections',
          filter: `proposal_id=eq.${proposalId}`
        },
        () => onSectionChange()
      )
      .subscribe()
    
    channels.push(sectionChannel)
  }

  // Subscribe to item changes
  if (onItemChange) {
    const itemChannel = supabase
      .channel(`proposal-items-${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposal_items',
          filter: `proposal_id=eq.${proposalId}`
        },
        () => onItemChange()
      )
      .subscribe()
    
    channels.push(itemChannel)
  }

  // Return cleanup function
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel)
    })
  }
}

// Set up real-time subscription for all proposals of a user
export function subscribeToUserProposals(
  userId: string,
  onProposalChange?: () => void
): () => void {
  const channel = supabase
    .channel(`user-proposals-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals',
        filter: `user_id=eq.${userId}`
      },
      () => {
        if (onProposalChange) onProposalChange()
      }
    )
    .subscribe()

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel)
  }
}

// Set up real-time subscription for proposal status changes
export function subscribeToProposalStatusChanges(
  userId: string,
  onStatusChange?: (status: string, proposalId: string) => void
): () => void {
  const channel = supabase
    .channel(`proposal-status-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'proposals',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        const oldStatus = payload.old?.status
        const newStatus = payload.new?.status
        
        if (oldStatus !== newStatus && onStatusChange) {
          onStatusChange(newStatus, payload.new.id)
        }
      }
    )
    .subscribe()

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel)
  }
}

// Set up real-time subscription for client-specific proposals
export function subscribeToClientProposals(
  userId: string,
  clientId: string,
  onProposalChange?: () => void
): () => void {
  const channel = supabase
    .channel(`client-proposals-${clientId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals',
        filter: `user_id=eq.${userId} AND client_id=eq.${clientId}`
      },
      () => {
        if (onProposalChange) onProposalChange()
      }
    )
    .subscribe()

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel)
  }
}