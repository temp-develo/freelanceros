'use client';

import { NextRequest, NextResponse } from 'next/server';
import { trackEmailOpen, trackEmailClick } from '@/lib/proposals/email-sender';

// Transparent 1x1 pixel GIF for tracking opens
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const token = searchParams.get('token');
    
    if (!token) {
      return new NextResponse('Missing token', { status: 400 });
    }
    
    if (type === 'open') {
      // Track email open
      await trackEmailOpen(token);
      
      // Return a transparent 1x1 pixel GIF
      return new NextResponse(TRACKING_PIXEL, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else if (type === 'click') {
      // Track email click
      await trackEmailClick(token);
      
      // Get the redirect URL
      const redirectUrl = searchParams.get('url');
      
      if (redirectUrl) {
        // Redirect to the target URL
        return NextResponse.redirect(redirectUrl);
      } else {
        return new NextResponse('Missing redirect URL', { status: 400 });
      }
    } else {
      return new NextResponse('Invalid tracking type', { status: 400 });
    }
  } catch (error) {
    console.error('Tracking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}