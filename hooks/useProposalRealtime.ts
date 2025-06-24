'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface UseProposalRealtimeOptions {
  onProposalChange?: () => void
  onProposalSectionChange?: () => void
  onProposalItemChange?: () => void
  proposalId?: string // Optional - if provided, only listen to changes for this proposal
}

interface UseProposalRealtimeReturn {
  isConnected: boolean
  activeSubscriptions: number
  lastEvent: {
    table: string | null
    event: string | null
    timestamp: Date | null
  }
}

export function useProposalRealtime(options: UseProposalRealtimeOptions = {}): UseProposalRealtimeReturn {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [activeSubscriptions, setActiveSubscriptions] = useState(0)
  const [lastEvent, setLastEvent] = useState<{
    table: string | null
    event: string | null
    timestamp: Date | null
  }>({
    table: null,
    event: null,
    timestamp: null
  })

  const setupSubscriptions = useCallback(() => {
    if (!user) return () => {}

    const channels = []
    let subscriptionCount = 0

    // Helper to handle events
    const handleEvent = (table: string, event: string) => {
      console.log(`Realtime event: ${event} on ${table}`)
      setLastEvent({
        table,
        event,
        timestamp: new Date()
      })

      // Call the appropriate callback
      if (table === 'proposals' && options.onProposalChange) {
        options.onProposalChange()
      } else if (table === 'proposal_sections' && options.onProposalSectionChange) {
        options.onProposalSectionChange()
      } else if (table === 'proposal_items' && options.onProposalItemChange) {
        options.onProposalItemChange()
      }
    }

    // Subscribe to proposals table
    if (options.onProposalChange) {
      let proposalsChannel
      
      if (options.proposalId) {
        // Subscribe to a specific proposal
        proposalsChannel = supabase
          .channel(`proposal-${options.proposalId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposals',
              filter: `id=eq.${options.proposalId}`
            },
            (payload) => handleEvent('proposals', payload.eventType)
          )
          .subscribe()
      } else {
        // Subscribe to all user's proposals
        proposalsChannel = supabase
          .channel('user-proposals')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposals',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => handleEvent('proposals', payload.eventType)
          )
          .subscribe()
      }
      
      channels.push(proposalsChannel)
      subscriptionCount++
    }

    // Subscribe to proposal sections table
    if (options.onProposalSectionChange) {
      let sectionsChannel
      
      if (options.proposalId) {
        // Subscribe to sections for a specific proposal
        sectionsChannel = supabase
          .channel(`proposal-sections-${options.proposalId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposal_sections',
              filter: `proposal_id=eq.${options.proposalId}`
            },
            (payload) => handleEvent('proposal_sections', payload.eventType)
          )
          .subscribe()
      } else {
        // For all sections, we need to filter by user's proposals
        // This is more complex and would require a join in the filter
        // For simplicity, we'll subscribe to all section changes
        // and filter in the callback
        sectionsChannel = supabase
          .channel('user-proposal-sections')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposal_sections'
            },
            (payload) => {
              // We'll need to check if this section belongs to the user's proposal
              // This would typically be handled by the callback function
              handleEvent('proposal_sections', payload.eventType)
            }
          )
          .subscribe()
      }
      
      channels.push(sectionsChannel)
      subscriptionCount++
    }

    // Subscribe to proposal items table
    if (options.onProposalItemChange) {
      let itemsChannel
      
      if (options.proposalId) {
        // Subscribe to items for a specific proposal
        itemsChannel = supabase
          .channel(`proposal-items-${options.proposalId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposal_items',
              filter: `proposal_id=eq.${options.proposalId}`
            },
            (payload) => handleEvent('proposal_items', payload.eventType)
          )
          .subscribe()
      } else {
        // For all items, similar to sections
        itemsChannel = supabase
          .channel('user-proposal-items')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'proposal_items'
            },
            (payload) => {
              handleEvent('proposal_items', payload.eventType)
            }
          )
          .subscribe()
      }
      
      channels.push(itemsChannel)
      subscriptionCount++
    }

    // Update state
    setIsConnected(subscriptionCount > 0)
    setActiveSubscriptions(subscriptionCount)

    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
      setIsConnected(false)
      setActiveSubscriptions(0)
    }
  }, [user, options])

  // Set up subscriptions
  useEffect(() => {
    const cleanup = setupSubscriptions()
    return cleanup
  }, [setupSubscriptions])

  return {
    isConnected,
    activeSubscriptions,
    lastEvent
  }
}