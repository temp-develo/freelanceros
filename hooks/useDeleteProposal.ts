'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { UseDeleteProposalReturn } from '@/types/proposals'

export function useDeleteProposal(): UseDeleteProposalReturn {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteProposal = useCallback(async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete a proposal')
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user owns the proposal
      const { data: proposalCheck, error: checkError } = await supabase
        .from('proposals')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (checkError || !proposalCheck) {
        throw new Error('Proposal not found or you do not have permission to delete it')
      }

      // Delete the proposal (cascade will handle sections and items)
      const { error: deleteError } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError
    } catch (err) {
      console.error('Error deleting proposal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete proposal'
      setError(new Error(errorMessage))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    deleteProposal,
    loading,
    error
  }
}