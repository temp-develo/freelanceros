'use client';

import { supabase } from '@/lib/supabase/client';
import { Proposal, ProposalSection, ProposalItem } from '@/types/proposals';

// Duplicate a proposal with all its sections and items
export async function duplicateProposal(
  proposalId: string,
  newTitle?: string
): Promise<string> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Fetch the original proposal
    const { data: originalProposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        clients!inner(id, name)
      `)
      .eq('id', proposalId)
      .eq('user_id', user.id)
      .single();
    
    if (proposalError || !originalProposal) {
      throw new Error('Failed to fetch original proposal');
    }
    
    // Fetch proposal sections
    const { data: originalSections, error: sectionsError } = await supabase
      .from('proposal_sections')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('order_position', { ascending: true });
    
    if (sectionsError) {
      throw new Error('Failed to fetch proposal sections');
    }
    
    // Fetch proposal items
    const { data: originalItems, error: itemsError } = await supabase
      .from('proposal_items')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('order_position', { ascending: true });
    
    if (itemsError) {
      throw new Error('Failed to fetch proposal items');
    }
    
    // Create a new proposal
    const { data: newProposal, error: createError } = await supabase
      .from('proposals')
      .insert({
        user_id: user.id,
        client_id: originalProposal.client_id,
        title: newTitle || `${originalProposal.title} (Copy)`,
        description: originalProposal.description,
        status: 'draft', // Always start as draft
        amount: originalProposal.amount,
        currency: originalProposal.currency,
        valid_until: originalProposal.valid_until
      })
      .select('id')
      .single();
    
    if (createError || !newProposal) {
      throw new Error('Failed to create new proposal');
    }
    
    // Duplicate sections
    if (originalSections && originalSections.length > 0) {
      const newSections = originalSections.map(section => ({
        proposal_id: newProposal.id,
        title: section.title,
        content: section.content,
        order_position: section.order_position
      }));
      
      const { error: sectionsInsertError } = await supabase
        .from('proposal_sections')
        .insert(newSections);
      
      if (sectionsInsertError) {
        throw new Error('Failed to duplicate proposal sections');
      }
    }
    
    // Duplicate items
    if (originalItems && originalItems.length > 0) {
      const newItems = originalItems.map(item => ({
        proposal_id: newProposal.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
        order_position: item.order_position
      }));
      
      const { error: itemsInsertError } = await supabase
        .from('proposal_items')
        .insert(newItems);
      
      if (itemsInsertError) {
        throw new Error('Failed to duplicate proposal items');
      }
    }
    
    return newProposal.id;
  } catch (error) {
    console.error('Error duplicating proposal:', error);
    throw error;
  }
}

// Create a proposal template from an existing proposal
export async function createTemplateFromProposal(
  proposalId: string,
  templateName: string
): Promise<string> {
  try {
    // This would be similar to duplicateProposal but would save to a templates table
    // For now, we'll just use the duplicate function
    const newProposalId = await duplicateProposal(proposalId, templateName);
    
    // In a real implementation, we would mark this as a template
    // or save it to a separate templates table
    
    return newProposalId;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

// Apply a template to create a new proposal
export async function applyProposalTemplate(
  templateId: string,
  clientId: string,
  title: string
): Promise<string> {
  try {
    // This would be similar to duplicateProposal but would use a template as the source
    // For now, we'll just use the duplicate function
    const newProposalId = await duplicateProposal(templateId, title);
    
    // Update the client ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('proposals')
      .update({ client_id: clientId })
      .eq('id', newProposalId)
      .eq('user_id', user.id);
    
    if (error) {
      throw new Error('Failed to update client for new proposal');
    }
    
    return newProposalId;
  } catch (error) {
    console.error('Error applying template:', error);
    throw error;
  }
}