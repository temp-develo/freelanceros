import type { 
  Proposal, 
  ProposalSection, 
  ProposalItem,
  ProposalRow,
  ProposalSectionRow,
  ProposalItemRow
} from '@/types/proposals'

// Convert database row to frontend Proposal type
export function transformProposalRow(row: ProposalRow & { clients?: { name: string } }): Proposal {
  return {
    id: row.id,
    userId: row.user_id,
    clientId: row.client_id,
    clientName: row.clients?.name || '',
    title: row.title,
    description: row.description,
    status: row.status as any,
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

// Convert database row to frontend ProposalSection type
export function transformProposalSectionRow(row: ProposalSectionRow): ProposalSection {
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

// Convert database row to frontend ProposalItem type
export function transformProposalItemRow(row: ProposalItemRow): ProposalItem {
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

// Convert frontend Proposal type to database insert/update format
export function prepareProposalForDatabase(proposal: Partial<Proposal>) {
  return {
    user_id: proposal.userId,
    client_id: proposal.clientId,
    title: proposal.title,
    description: proposal.description,
    status: proposal.status,
    amount: proposal.amount,
    currency: proposal.currency,
    valid_until: proposal.validUntil,
    sent_at: proposal.sentAt,
    viewed_at: proposal.viewedAt,
    responded_at: proposal.respondedAt
  }
}

// Convert frontend ProposalSection type to database insert/update format
export function prepareSectionForDatabase(section: Partial<ProposalSection>) {
  return {
    proposal_id: section.proposalId,
    title: section.title,
    content: section.content,
    order_position: section.orderPosition
  }
}

// Convert frontend ProposalItem type to database insert/update format
export function prepareItemForDatabase(item: Partial<ProposalItem>) {
  return {
    proposal_id: item.proposalId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    amount: item.amount,
    order_position: item.orderPosition
  }
}

// Convert a complete proposal with sections and items
export function transformCompleteProposal(
  proposalRow: ProposalRow & { clients?: { name: string } },
  sectionRows: ProposalSectionRow[],
  itemRows: ProposalItemRow[]
): Proposal {
  const proposal = transformProposalRow(proposalRow)
  
  proposal.sections = sectionRows.map(transformProposalSectionRow)
  proposal.items = itemRows.map(transformProposalItemRow)
  
  return proposal
}