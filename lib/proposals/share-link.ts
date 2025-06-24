'use client';

import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/client';

interface ShareLinkData {
  token: string;
  proposalId: string;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
}

// Generate a secure share link for a proposal
export async function generateShareLink(
  proposalId: string,
  expiryDays: number = 30
): Promise<string> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Generate a unique token
    const token = uuidv4();
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    // Store the share link in the database
    // In a real implementation, this would be stored in a separate table
    const { error } = await supabase.from('proposal_share_links')
      .insert({
        token,
        proposal_id: proposalId,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        created_by: user.id
      });
    
    if (error) {
      console.error('Error creating share link:', error);
      throw new Error('Failed to create share link');
    }
    
    // Generate the full URL
    // In a real implementation, this would use the actual domain
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/proposals/share/${token}`;
    
    return shareUrl;
  } catch (error) {
    console.error('Error generating share link:', error);
    throw error;
  }
}

// Validate a share link token
export async function validateShareLink(token: string): Promise<{ 
  valid: boolean; 
  proposalId?: string;
  expired?: boolean;
}> {
  try {
    // In a real implementation, this would query the database
    // For demo purposes, we'll simulate a database query
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if the token exists and is valid
    const { data, error } = await supabase.from('proposal_share_links')
      .select('proposal_id, expires_at')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      return { valid: false };
    }
    
    // Check if the link has expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (expiresAt < now) {
      return { valid: false, expired: true };
    }
    
    return { valid: true, proposalId: data.proposal_id };
  } catch (error) {
    console.error('Error validating share link:', error);
    return { valid: false };
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
}

// Revoke a share link
export async function revokeShareLink(token: string): Promise<boolean> {
  try {
    // In a real implementation, this would delete the link from the database
    const { error } = await supabase.from('proposal_share_links')
      .delete()
      .eq('token', token);
    
    if (error) {
      console.error('Error revoking share link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error revoking share link:', error);
    return false;
  }
}

// Get all share links for a proposal
export async function getProposalShareLinks(proposalId: string): Promise<ShareLinkData[]> {
  try {
    // In a real implementation, this would query the database
    const { data, error } = await supabase.from('proposal_share_links')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching share links:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching share links:', error);
    return [];
  }
}