'use client';

import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

interface SendProposalEmailParams {
  to: string;
  subject: string;
  message: string;
  proposalId: string;
  proposalTitle: string;
  clientName: string;
}

export async function sendProposalEmail({
  to,
  subject,
  message,
  proposalId,
  proposalTitle,
  clientName
}: SendProposalEmailParams): Promise<boolean> {
  try {
    // In a real implementation, this would call a serverless function
    // that would use a service like SendGrid, Mailgun, etc.
    // For this demo, we'll simulate sending an email
    
    // Validate email
    if (!isValidEmail(to)) {
      throw new Error('Invalid email address');
    }
    
    // Generate a tracking token
    const trackingToken = generateTrackingToken();
    
    // Store the email sending record in the database
    // This would typically be done in a separate table
    const { error } = await supabase.from('proposal_emails')
      .insert({
        proposal_id: proposalId,
        recipient_email: to,
        subject,
        sent_at: new Date().toISOString(),
        tracking_token: trackingToken
      });
    
    if (error) {
      console.error('Error recording email send:', error);
      // Continue anyway for demo purposes
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the email for demo purposes
    console.log('Email sent:', {
      to,
      subject,
      message,
      proposalId,
      trackingToken
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
function generateTrackingToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Function to track when a proposal is viewed via email
export async function trackProposalView(trackingToken: string): Promise<void> {
  try {
    // In a real implementation, this would update the database
    // to mark the proposal as viewed
    console.log('Tracking proposal view:', trackingToken);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This would update the proposal status to 'viewed'
    // and record the view timestamp
  } catch (error) {
    console.error('Error tracking proposal view:', error);
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