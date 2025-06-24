'use client';

import { NextRequest, NextResponse } from 'next/server';
import { sendProposalEmail } from '@/lib/proposals/email-sender';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.to || !body.subject || !body.message || !body.proposalId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Send email
    await sendProposalEmail({
      to: body.to,
      cc: body.cc,
      subject: body.subject,
      message: body.message,
      proposalId: body.proposalId,
      proposalTitle: body.proposalTitle,
      clientName: body.clientName,
      includeAttachment: body.includeAttachment,
      trackOpens: body.trackOpens,
      trackClicks: body.trackClicks,
      expiryDays: body.expiryDays
    });
    
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}