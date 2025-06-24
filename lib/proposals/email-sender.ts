'use client';

import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface SendProposalEmailParams {
  to: string;
  cc?: string;
  subject: string;
  message: string;
  proposalId: string;
  proposalTitle: string;
  clientName: string;
  includeAttachment?: boolean;
  trackOpens?: boolean;
  trackClicks?: boolean;
  expiryDays?: number;
}

export async function sendProposalEmail({
  to,
  cc,
  subject,
  message,
  proposalId,
  proposalTitle,
  clientName,
  includeAttachment = true,
  trackOpens = true,
  trackClicks = true,
  expiryDays = 30
}: SendProposalEmailParams): Promise<boolean> {
  try {
    // In a real implementation, this would call a serverless function
    // that would use a service like Resend, SendGrid, Mailgun, etc.
    // For this demo, we'll simulate sending an email
    
    // Validate email
    if (!isValidEmail(to)) {
      throw new Error('Invalid recipient email address');
    }
    
    if (cc && !isValidEmail(cc)) {
      throw new Error('Invalid CC email address');
    }
    
    // Generate tracking tokens
    const emailId = uuidv4();
    const openTrackingToken = trackOpens ? generateTrackingToken('open') : null;
    const clickTrackingToken = trackClicks ? generateTrackingToken('click') : null;
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Generate a share link for the proposal
    const shareToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    // Store the share link
    const { error: shareError } = await supabase.from('proposal_share_links')
      .insert({
        token: shareToken,
        proposal_id: proposalId,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        created_by: user.id
      });
    
    if (shareError) {
      console.error('Error creating share link:', shareError);
      throw new Error('Failed to create share link for the proposal');
    }
    
    // Store the email sending record
    const { error: emailError } = await supabase.from('proposal_emails')
      .insert({
        id: emailId,
        proposal_id: proposalId,
        recipient_email: to,
        cc_email: cc || null,
        subject,
        message,
        tracking_token: openTrackingToken,
        click_tracking_token: clickTrackingToken,
        share_token: shareToken,
        sent_at: new Date().toISOString(),
        include_attachment: includeAttachment
      });
    
    if (emailError) {
      console.error('Error recording email send:', emailError);
      throw new Error('Failed to record email send');
    }
    
    // Update the proposal status to 'sent' if it's in draft
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select('status')
      .eq('id', proposalId)
      .single();
    
    if (proposalError) {
      console.error('Error fetching proposal:', proposalError);
      // Continue anyway
    } else if (proposalData.status === 'draft') {
      const { error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', proposalId);
      
      if (updateError) {
        console.error('Error updating proposal status:', updateError);
        // Continue anyway
      }
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the email for demo purposes
    console.log('Email sent:', {
      to,
      cc,
      subject,
      message,
      proposalId,
      openTrackingToken,
      clickTrackingToken,
      shareToken,
      includeAttachment
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate a unique tracking token
function generateTrackingToken(type: 'open' | 'click'): string {
  return `${type}_${uuidv4()}`;
}

// Function to track when a proposal email is opened
export async function trackEmailOpen(trackingToken: string): Promise<void> {
  try {
    // In a real implementation, this would update the database
    console.log('Tracking email open:', trackingToken);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the email record
    const { error } = await supabase.from('proposal_emails')
      .update({
        opened_at: new Date().toISOString()
      })
      .eq('tracking_token', trackingToken);
    
    if (error) {
      console.error('Error tracking email open:', error);
    }
  } catch (error) {
    console.error('Error tracking email open:', error);
  }
}

// Function to track when a proposal link is clicked
export async function trackEmailClick(trackingToken: string): Promise<void> {
  try {
    // In a real implementation, this would update the database
    console.log('Tracking email click:', trackingToken);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the email record
    const { error } = await supabase.from('proposal_emails')
      .update({
        click_count: supabase.rpc('increment', { x: 1 })
      })
      .eq('click_tracking_token', trackingToken);
    
    if (error) {
      console.error('Error tracking email click:', error);
    }
  } catch (error) {
    console.error('Error tracking email click:', error);
  }
}

// Function to send a notification when a proposal is accepted or rejected
export async function sendProposalResponseNotification(
  proposalId: string,
  status: 'accepted' | 'rejected',
  message?: string
): Promise<void> {
  try {
    // In a real implementation, this would send an email notification
    // to the proposal creator
    console.log('Sending proposal response notification:', {
      proposalId,
      status,
      message
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Notification sent: Proposal ${status}`);
  } catch (error) {
    console.error('Error sending notification:', error);
    toast.error('Failed to send notification');
  }
}

// Get email history for a proposal
export async function getProposalEmailHistory(proposalId: string): Promise<any[]> {
  try {
    // In a real implementation, this would query the database
    const { data, error } = await supabase.from('proposal_emails')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('sent_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data
    return data.map((email: any) => ({
      id: email.id,
      recipientEmail: email.recipient_email,
      subject: email.subject,
      sentAt: email.sent_at,
      openedAt: email.opened_at,
      clickCount: email.click_count || 0,
      status: email.opened_at 
        ? (email.click_count > 0 ? 'clicked' : 'opened') 
        : 'delivered'
    }));
  } catch (error) {
    console.error('Error fetching email history:', error);
    throw error;
  }
}

// Get email statistics for a proposal
export async function getProposalEmailStats(proposalId: string): Promise<any> {
  try {
    // In a real implementation, this would query the database
    const { data, error } = await supabase.from('proposal_emails')
      .select('*')
      .eq('proposal_id', proposalId);
    
    if (error) {
      throw error;
    }
    
    // Calculate statistics
    const totalSent = data.length;
    const totalOpened = data.filter((email: any) => email.opened_at).length;
    const totalClicked = data.filter((email: any) => email.click_count > 0).length;
    
    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;
    
    // Calculate average time to open
    let totalTimeToOpen = 0;
    let openCount = 0;
    
    data.forEach((email: any) => {
      if (email.opened_at && email.sent_at) {
        const sentTime = new Date(email.sent_at).getTime();
        const openedTime = new Date(email.opened_at).getTime();
        const timeToOpenMinutes = (openedTime - sentTime) / (1000 * 60);
        
        totalTimeToOpen += timeToOpenMinutes;
        openCount++;
      }
    });
    
    const averageTimeToOpen = openCount > 0 ? totalTimeToOpen / openCount : 0;
    
    // Get latest timestamps
    const sortedByDate = [...data].sort((a: any, b: any) => {
      return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime();
    });
    
    const lastSentAt = sortedByDate.length > 0 ? sortedByDate[0].sent_at : null;
    
    const openedEmails = data.filter((email: any) => email.opened_at);
    const sortedByOpenDate = [...openedEmails].sort((a: any, b: any) => {
      return new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime();
    });
    
    const lastOpenedAt = sortedByOpenDate.length > 0 ? sortedByOpenDate[0].opened_at : null;
    
    return {
      totalSent,
      totalOpened,
      totalClicked,
      openRate,
      clickRate,
      averageTimeToOpen,
      lastSentAt,
      lastOpenedAt
    };
  } catch (error) {
    console.error('Error fetching email stats:', error);
    throw error;
  }
}

// Create email template
export async function createEmailTemplate(template: {
  name: string;
  subject: string;
  body: string;
  isDefault?: boolean;
}): Promise<any> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Store the template
    const { data, error } = await supabase.from('email_templates')
      .insert({
        user_id: user.id,
        name: template.name,
        subject: template.subject,
        body: template.body,
        is_default: template.isDefault || false
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
}

// Get email templates
export async function getEmailTemplates(): Promise<any[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get templates
    const { data, error } = await supabase.from('email_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
}

// Delete email template
export async function deleteEmailTemplate(templateId: string): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Delete template
    const { error } = await supabase.from('email_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting email template:', error);
    throw error;
  }
}