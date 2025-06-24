import { supabase } from '@/lib/supabase/client'
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

// Transform database rows to frontend types
export function transformProposal(row: any): Proposal {
  return {
    id: row.id,
    userId: row.user_id,
    clientId: row.client_id,
    clientName: row.clients?.name || '',
    title: row.title,
    description: row.description,
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    validUntil: row.valid_until,
    sentAt: row.sent_at,
    viewedAt: row.viewed_at,
    respondedAt: row.responded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function transformProposalSection(row: any): ProposalSection {
  return {
    id: row.id,
    proposalId: row.proposal_id,
    title: row.title,
    content: row.content,
    orderPosition: row.order_position,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function transformProposalItem(row: any): ProposalItem {
  return {
    id: row.id,
    proposalId: row.proposal_id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    amount: row.amount,
    orderPosition: row.order_position,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Fetch proposals with filtering, pagination, and sorting
export async function fetchProposals(
  userId: string,
  filters: ProposalFilters = {},
  pagination: ProposalPagination = { page: 1, pageSize: 10 },
  sorting: ProposalSorting = { column: 'created_at', direction: 'desc' }
) {
  try {
    // Calculate pagination range
    const from = (pagination.page - 1) * pagination.pageSize
    const to = from + pagination.pageSize - 1

    // Start building the query
    let query = supabase
      .from('proposals')
      .select(`
        *,
        clients!inner(id, name)
      `, { count: 'exact' })
      .eq('user_id', userId)

    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status)
      } else {
        query = query.eq('status', filters.status)
      }
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    if (filters.minAmount) {
      query = query.gte('amount', filters.minAmount)
    }

    if (filters.maxAmount) {
      query = query.lte('amount', filters.maxAmount)
    }

    // Apply sorting
    query = query.order(sorting.column, { ascending: sorting.direction === 'asc' })

    // Apply pagination
    query = query.range(from, to)

    // Execute the query
    const { data, error, count } = await query

    if (error) throw error

    // Transform the data
    const proposals = data.map(transformProposal)

    return {
      proposals,
      count: count || 0,
      hasMore: count ? from + proposals.length < count : false
    }
  } catch (error) {
    console.error('Error fetching proposals:', error)
    throw error
  }
}

// Fetch a single proposal with its sections and items
export async function fetchProposal(userId: string, proposalId: string) {
  try {
    // Fetch the proposal with client information
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        clients!inner(id, name)
      `)
      .eq('id', proposalId)
      .eq('user_id', userId)
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
    const proposal = transformProposal(proposalData)
    proposal.sections = sectionsData.map(transformProposalSection)
    proposal.items = itemsData.map(transformProposalItem)

    return proposal
  } catch (error) {
    console.error('Error fetching proposal:', error)
    throw error
  }
}

// Create a new proposal
export async function createProposal(userId: string, data: ProposalInsert) {
  try {
    // Ensure user_id is set
    const proposalData = {
      ...data,
      user_id: userId
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
    return transformProposal(insertedProposal)
  } catch (error) {
    console.error('Error creating proposal:', error)
    throw error
  }
}

// Add a section to a proposal
export async function addProposalSection(userId: string, data: ProposalSectionInsert) {
  try {
    // Verify user owns the proposal
    const { data: proposalCheck, error: checkError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', data.proposal_id)
      .eq('user_id', userId)
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
    return transformProposalSection(insertedSection)
  } catch (error) {
    console.error('Error adding proposal section:', error)
    throw error
  }
}

// Add an item to a proposal
export async function addProposalItem(userId: string, data: ProposalItemInsert) {
  try {
    // Verify user owns the proposal
    const { data: proposalCheck, error: checkError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', data.proposal_id)
      .eq('user_id', userId)
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
    await updateProposalAmount(userId, data.proposal_id)

    // Transform the response
    return transformProposalItem(insertedItem)
  } catch (error) {
    console.error('Error adding proposal item:', error)
    throw error
  }
}

// Update a proposal
export async function updateProposal(userId: string, id: string, data: ProposalUpdate) {
  try {
    // Update the proposal
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        clients!inner(id, name)
      `)
      .single()

    if (updateError) throw updateError

    // Transform the response
    return transformProposal(updatedProposal)
  } catch (error) {
    console.error('Error updating proposal:', error)
    throw error
  }
}

// Update a proposal section
export async function updateProposalSection(userId: string, id: string, data: ProposalSectionUpdate) {
  try {
    // Verify user owns the section's proposal
    const { data: sectionCheck, error: checkError } = await supabase
      .from('proposal_sections')
      .select(`
        proposal_id,
        proposals!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (checkError || !sectionCheck || sectionCheck.proposals.user_id !== userId) {
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
    return transformProposalSection(updatedSection)
  } catch (error) {
    console.error('Error updating proposal section:', error)
    throw error
  }
}

// Update a proposal item
export async function updateProposalItem(userId: string, id: string, data: ProposalItemUpdate) {
  try {
    // Verify user owns the item's proposal
    const { data: itemCheck, error: checkError } = await supabase
      .from('proposal_items')
      .select(`
        proposal_id,
        proposals!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (checkError || !itemCheck || itemCheck.proposals.user_id !== userId) {
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
    await updateProposalAmount(userId, itemCheck.proposal_id)

    // Transform the response
    return transformProposalItem(updatedItem)
  } catch (error) {
    console.error('Error updating proposal item:', error)
    throw error
  }
}

// Delete a proposal section
export async function deleteProposalSection(userId: string, id: string) {
  try {
    // Verify user owns the section's proposal
    const { data: sectionCheck, error: checkError } = await supabase
      .from('proposal_sections')
      .select(`
        proposal_id,
        proposals!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (checkError || !sectionCheck || sectionCheck.proposals.user_id !== userId) {
      throw new Error('Section not found or you do not have permission to delete it')
    }

    // Delete the section
    const { error: deleteError } = await supabase
      .from('proposal_sections')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  } catch (error) {
    console.error('Error deleting proposal section:', error)
    throw error
  }
}

// Delete a proposal item
export async function deleteProposalItem(userId: string, id: string) {
  try {
    // Verify user owns the item's proposal and get proposal_id
    const { data: itemCheck, error: checkError } = await supabase
      .from('proposal_items')
      .select(`
        proposal_id,
        proposals!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (checkError || !itemCheck || itemCheck.proposals.user_id !== userId) {
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
    await updateProposalAmount(userId, proposalId)
  } catch (error) {
    console.error('Error deleting proposal item:', error)
    throw error
  }
}

// Delete a proposal
export async function deleteProposal(userId: string, id: string) {
  try {
    // Verify user owns the proposal
    const { data: proposalCheck, error: checkError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (checkError || !proposalCheck) {
      throw new Error('Proposal not found or you do not have permission to delete it')
    }

    // Delete the proposal (cascade will handle sections and items)
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (deleteError) throw deleteError
  } catch (error) {
    console.error('Error deleting proposal:', error)
    throw error
  }
}

// Send a proposal (update status to 'sent')
export async function sendProposal(userId: string, id: string) {
  try {
    // Update the proposal status to 'sent' and set sent_at timestamp
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        clients!inner(id, name)
      `)
      .single()

    if (updateError) throw updateError

    // Transform the response
    return transformProposal(updatedProposal)
  } catch (error) {
    console.error('Error sending proposal:', error)
    throw error
  }
}

// Mark a proposal as viewed
export async function markProposalAsViewed(proposalId: string) {
  try {
    // This function would typically be called from a client portal or tracking pixel
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'viewed',
        viewed_at: new Date().toISOString()
      })
      .eq('id', proposalId)
      .in('status', ['sent']) // Only update if current status is 'sent'
      .select('*')
      .single()

    if (updateError) throw updateError

    return updatedProposal
  } catch (error) {
    console.error('Error marking proposal as viewed:', error)
    throw error
  }
}

// Mark a proposal as accepted
export async function markProposalAsAccepted(userId: string, id: string) {
  try {
    // Update the proposal status to 'accepted' and set responded_at timestamp
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        clients!inner(id, name)
      `)
      .single()

    if (updateError) throw updateError

    // Transform the response
    return transformProposal(updatedProposal)
  } catch (error) {
    console.error('Error marking proposal as accepted:', error)
    throw error
  }
}

// Mark a proposal as rejected
export async function markProposalAsRejected(userId: string, id: string) {
  try {
    // Update the proposal status to 'rejected' and set responded_at timestamp
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'rejected',
        responded_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        clients!inner(id, name)
      `)
      .single()

    if (updateError) throw updateError

    // Transform the response
    return transformProposal(updatedProposal)
  } catch (error) {
    console.error('Error marking proposal as rejected:', error)
    throw error
  }
}

// Check for expired proposals and update their status
export async function checkForExpiredProposals(userId: string) {
  try {
    const now = new Date().toISOString()

    // Find proposals that have passed their valid_until date but are still in sent/viewed status
    const { data: expiredProposals, error: fetchError } = await supabase
      .from('proposals')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['sent', 'viewed'])
      .lt('valid_until', now)

    if (fetchError) throw fetchError

    if (expiredProposals && expiredProposals.length > 0) {
      // Update all expired proposals
      const { error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'expired'
        })
        .in('id', expiredProposals.map(p => p.id))
        .eq('user_id', userId)

      if (updateError) throw updateError

      return expiredProposals.length
    }

    return 0
  } catch (error) {
    console.error('Error checking for expired proposals:', error)
    throw error
  }
}

// Search proposals by title, description, or client name
export async function searchProposals(userId: string, query: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients!inner(id, name)
      `)
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,clients.name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Transform the data
    return data.map(transformProposal)
  } catch (error) {
    console.error('Error searching proposals:', error)
    throw error
  }
}

// Get proposal statistics
export async function getProposalStats(userId: string) {
  try {
    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('proposals')
      .select('status, count')
      .eq('user_id', userId)
      .group('status')

    if (statusError) throw statusError

    // Get total amount for accepted proposals
    const { data: acceptedAmount, error: amountError } = await supabase
      .from('proposals')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'accepted')

    if (amountError) throw amountError

    // Get conversion rate (accepted / (accepted + rejected))
    const acceptedCount = statusCounts.find(s => s.status === 'accepted')?.count || 0
    const rejectedCount = statusCounts.find(s => s.status === 'rejected')?.count || 0
    const totalResponded = Number(acceptedCount) + Number(rejectedCount)
    const conversionRate = totalResponded > 0 ? (Number(acceptedCount) / totalResponded) * 100 : 0

    // Calculate total value
    const totalAcceptedValue = acceptedAmount.reduce((sum, p) => sum + (p.amount || 0), 0)

    return {
      counts: {
        total: statusCounts.reduce((sum, s) => sum + Number(s.count), 0),
        draft: statusCounts.find(s => s.status === 'draft')?.count || 0,
        sent: statusCounts.find(s => s.status === 'sent')?.count || 0,
        viewed: statusCounts.find(s => s.status === 'viewed')?.count || 0,
        accepted: acceptedCount,
        rejected: rejectedCount,
        expired: statusCounts.find(s => s.status === 'expired')?.count || 0
      },
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      totalAcceptedValue
    }
  } catch (error) {
    console.error('Error getting proposal stats:', error)
    throw error
  }
}

// Helper function to update proposal amount based on items
export async function updateProposalAmount(userId: string, proposalId: string) {
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
      .eq('user_id', userId)

    if (updateError) throw updateError
  } catch (error) {
    console.error('Error updating proposal amount:', error)
    throw error
  }
}

// Set up real-time subscription for a proposal
export function subscribeToProposal(proposalId: string, callback: () => void) {
  const channel = supabase
    .channel(`proposal-${proposalId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals',
        filter: `id=eq.${proposalId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposal_sections',
        filter: `proposal_id=eq.${proposalId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposal_items',
        filter: `proposal_id=eq.${proposalId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Set up real-time subscription for all proposals
export function subscribeToAllProposals(userId: string, callback: () => void) {
  const channel = supabase
    .channel(`proposals-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}