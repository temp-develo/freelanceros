'use client'

import { CompleteProposalData } from '@/lib/validations/proposal'

const STORAGE_KEY = 'proposal_draft'
const STORAGE_VERSION = '1.0'

interface StoredProposalDraft {
  version: string
  data: Partial<CompleteProposalData>
  lastSaved: string
  userId: string
}

export class ProposalDraftStorage {
  private static instance: ProposalDraftStorage
  
  static getInstance(): ProposalDraftStorage {
    if (!ProposalDraftStorage.instance) {
      ProposalDraftStorage.instance = new ProposalDraftStorage()
    }
    return ProposalDraftStorage.instance
  }

  private constructor() {}

  /**
   * Save proposal draft to localStorage
   */
  saveDraft(data: Partial<CompleteProposalData>, userId: string): void {
    try {
      const draft: StoredProposalDraft = {
        version: STORAGE_VERSION,
        data,
        lastSaved: new Date().toISOString(),
        userId
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch (error) {
      console.error('Failed to save proposal draft:', error)
      throw new Error('Unable to save draft. Please try again.')
    }
  }

  /**
   * Load proposal draft from localStorage
   */
  loadDraft(userId: string): Partial<CompleteProposalData> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const draft: StoredProposalDraft = JSON.parse(stored)

      // Check version compatibility
      if (draft.version !== STORAGE_VERSION) {
        console.warn('Draft version mismatch, clearing old draft')
        this.clearDraft()
        return null
      }

      // Check if draft belongs to current user
      if (draft.userId !== userId) {
        return null
      }

      return draft.data
    } catch (error) {
      console.error('Failed to load proposal draft:', error)
      this.clearDraft() // Clear corrupted data
      return null
    }
  }

  /**
   * Get draft metadata (last saved time, etc.)
   */
  getDraftMetadata(userId: string): { lastSaved: Date; hasData: boolean } | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const draft: StoredProposalDraft = JSON.parse(stored)

      if (draft.userId !== userId) {
        return null
      }

      return {
        lastSaved: new Date(draft.lastSaved),
        hasData: Object.keys(draft.data).length > 0
      }
    } catch (error) {
      console.error('Failed to get draft metadata:', error)
      return null
    }
  }

  /**
   * Clear proposal draft from localStorage
   */
  clearDraft(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear proposal draft:', error)
    }
  }

  /**
   * Check if there's a saved draft for the user
   */
  hasDraft(userId: string): boolean {
    const metadata = this.getDraftMetadata(userId)
    return metadata?.hasData ?? false
  }

  /**
   * Get the age of the draft in minutes
   */
  getDraftAge(userId: string): number | null {
    const metadata = this.getDraftMetadata(userId)
    if (!metadata) return null

    const now = new Date()
    const ageInMs = now.getTime() - metadata.lastSaved.getTime()
    return Math.floor(ageInMs / (1000 * 60)) // Convert to minutes
  }
}

// Export singleton instance
export const proposalDraftStorage = ProposalDraftStorage.getInstance()

// Helper functions for easier usage
export function saveProposalDraft(data: Partial<CompleteProposalData>, userId: string): void {
  proposalDraftStorage.saveDraft(data, userId)
}

export function loadProposalDraft(userId: string): Partial<CompleteProposalData> | null {
  return proposalDraftStorage.loadDraft(userId)
}

export function clearProposalDraft(): void {
  proposalDraftStorage.clearDraft()
}

export function hasProposalDraft(userId: string): boolean {
  return proposalDraftStorage.hasDraft(userId)
}

export function getProposalDraftAge(userId: string): number | null {
  return proposalDraftStorage.getDraftAge(userId)
}