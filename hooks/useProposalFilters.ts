'use client'

import { useState, useCallback } from 'react'
import type { ProposalFilters, ProposalPagination, ProposalSorting } from '@/types/proposals'

interface UseProposalFiltersOptions {
  initialFilters?: ProposalFilters
  initialPagination?: ProposalPagination
  initialSorting?: ProposalSorting
  onFiltersChange?: (filters: ProposalFilters) => void
  onPaginationChange?: (pagination: ProposalPagination) => void
  onSortingChange?: (sorting: ProposalSorting) => void
}

interface UseProposalFiltersReturn {
  filters: ProposalFilters
  pagination: ProposalPagination
  sorting: ProposalSorting
  setFilters: (filters: ProposalFilters) => void
  updateFilter: <K extends keyof ProposalFilters>(key: K, value: ProposalFilters[K]) => void
  resetFilters: () => void
  setPagination: (pagination: ProposalPagination) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  nextPage: () => void
  prevPage: () => void
  setSorting: (sorting: ProposalSorting) => void
  toggleSortDirection: () => void
  setSortColumn: (column: string) => void
}

export function useProposalFilters({
  initialFilters = {},
  initialPagination = { page: 1, pageSize: 10 },
  initialSorting = { column: 'created_at', direction: 'desc' },
  onFiltersChange,
  onPaginationChange,
  onSortingChange
}: UseProposalFiltersOptions = {}): UseProposalFiltersReturn {
  const [filters, setFiltersState] = useState<ProposalFilters>(initialFilters)
  const [pagination, setPaginationState] = useState<ProposalPagination>(initialPagination)
  const [sorting, setSortingState] = useState<ProposalSorting>(initialSorting)

  // Filters
  const setFilters = useCallback((newFilters: ProposalFilters) => {
    setFiltersState(newFilters)
    // Reset to page 1 when filters change
    setPaginationState(prev => ({ ...prev, page: 1 }))
    onFiltersChange?.(newFilters)
  }, [onFiltersChange])

  const updateFilter = useCallback(<K extends keyof ProposalFilters>(key: K, value: ProposalFilters[K]) => {
    setFiltersState(prev => {
      const newFilters = { ...prev, [key]: value }
      onFiltersChange?.(newFilters)
      return newFilters
    })
    // Reset to page 1 when filters change
    setPaginationState(prev => ({ ...prev, page: 1 }))
  }, [onFiltersChange])

  const resetFilters = useCallback(() => {
    setFiltersState({})
    onFiltersChange?.({})
    // Reset to page 1 when filters are reset
    setPaginationState(prev => ({ ...prev, page: 1 }))
  }, [onFiltersChange])

  // Pagination
  const setPagination = useCallback((newPagination: ProposalPagination) => {
    setPaginationState(newPagination)
    onPaginationChange?.(newPagination)
  }, [onPaginationChange])

  const setPage = useCallback((page: number) => {
    setPaginationState(prev => {
      const newPagination = { ...prev, page }
      onPaginationChange?.(newPagination)
      return newPagination
    })
  }, [onPaginationChange])

  const setPageSize = useCallback((pageSize: number) => {
    setPaginationState(prev => {
      const newPagination = { ...prev, pageSize, page: 1 } // Reset to page 1 when changing page size
      onPaginationChange?.(newPagination)
      return newPagination
    })
  }, [onPaginationChange])

  const nextPage = useCallback(() => {
    setPaginationState(prev => {
      const newPagination = { ...prev, page: prev.page + 1 }
      onPaginationChange?.(newPagination)
      return newPagination
    })
  }, [onPaginationChange])

  const prevPage = useCallback(() => {
    setPaginationState(prev => {
      const newPagination = { ...prev, page: Math.max(1, prev.page - 1) }
      onPaginationChange?.(newPagination)
      return newPagination
    })
  }, [onPaginationChange])

  // Sorting
  const setSorting = useCallback((newSorting: ProposalSorting) => {
    setSortingState(newSorting)
    onSortingChange?.(newSorting)
  }, [onSortingChange])

  const toggleSortDirection = useCallback(() => {
    setSortingState(prev => {
      const newDirection = prev.direction === 'asc' ? 'desc' : 'asc'
      const newSorting = { ...prev, direction: newDirection }
      onSortingChange?.(newSorting)
      return newSorting
    })
  }, [onSortingChange])

  const setSortColumn = useCallback((column: string) => {
    setSortingState(prev => {
      // If clicking the same column, toggle direction
      const newDirection = prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
      const newSorting = { column, direction: newDirection }
      onSortingChange?.(newSorting)
      return newSorting
    })
  }, [onSortingChange])

  return {
    filters,
    pagination,
    sorting,
    setFilters,
    updateFilter,
    resetFilters,
    setPagination,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    setSorting,
    toggleSortDirection,
    setSortColumn
  }
}