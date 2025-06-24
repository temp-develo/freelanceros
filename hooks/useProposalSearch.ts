'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { searchProposals } from '@/lib/supabase/proposals'
import type { Proposal } from '@/types/proposals'

interface UseProposalSearchOptions {
  initialQuery?: string
  debounceMs?: number
  limit?: number
  autoSearch?: boolean
}

interface UseProposalSearchReturn {
  results: Proposal[]
  loading: boolean
  error: Error | null
  query: string
  setQuery: (query: string) => void
  search: (query?: string) => Promise<void>
  clearResults: () => void
}

export function useProposalSearch({
  initialQuery = '',
  debounceMs = 300,
  limit = 10,
  autoSearch = true
}: UseProposalSearchOptions = {}): UseProposalSearchReturn {
  const { user } = useAuth()
  const [results, setResults] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [query, setQuery] = useState(initialQuery)
  
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  const search = useCallback(async (searchQuery?: string) => {
    const queryToUse = searchQuery !== undefined ? searchQuery : query
    
    if (!user || !queryToUse.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const results = await searchProposals(user.id, queryToUse, limit)
      setResults(results)
    } catch (err) {
      console.error('Error searching proposals:', err)
      setError(err instanceof Error ? err : new Error('Failed to search proposals'))
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [user, query, limit])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  // Handle query changes with debounce
  useEffect(() => {
    if (!autoSearch) return

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      if (query.trim()) {
        search(query)
      } else {
        clearResults()
      }
    }, debounceMs)

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, autoSearch, search, clearResults, debounceMs])

  return {
    results,
    loading,
    error,
    query,
    setQuery,
    search,
    clearResults
  }
}