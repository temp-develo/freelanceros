'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { getProposalEmailHistory } from '@/lib/proposals/email-sender';
import { 
  Mail, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MousePointer, 
  RefreshCw,
  Send,
  AlertCircle
} from 'lucide-react';

interface EmailHistoryListProps {
  proposalId: string;
  className?: string;
}

interface EmailRecord {
  id: string;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  openedAt: string | null;
  clickCount: number;
  status: 'delivered' | 'opened' | 'clicked' | 'failed';
}

export function EmailHistoryList({ proposalId, className }: EmailHistoryListProps) {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchEmailHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const history = await getProposalEmailHistory(proposalId);
      setEmails(history);
    } catch (error) {
      console.error('Error fetching email history:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch email history'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmailHistory();
  }, [proposalId]);
  
  // Get status badge
  const getStatusBadge = (email: EmailRecord) => {
    switch (email.status) {
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700">
            <Send className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case 'opened':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700">
            <Eye className="w-3 h-3 mr-1" />
            Opened
          </Badge>
        );
      case 'clicked':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700">
            <MousePointer className="w-3 h-3 mr-1" />
            Clicked
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary" />
            Email History
          </CardTitle>
          <CardDescription>
            Recent emails sent for this proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-md">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary" />
            Email History
          </CardTitle>
          <CardDescription>
            Recent emails sent for this proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mb-2" />
            <h3 className="font-medium mb-1">Failed to load email history</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            <Button variant="outline" size="sm" onClick={fetchEmailHistory}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Empty state
  if (emails.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary" />
            Email History
          </CardTitle>
          <CardDescription>
            Recent emails sent for this proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Mail className="w-10 h-10 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">No emails sent yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              When you send emails for this proposal, they will appear here.
            </p>
            <Button variant="outline" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send First Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary" />
              Email History
            </CardTitle>
            <CardDescription>
              Recent emails sent for this proposal
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEmailHistory}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium truncate">{email.subject}</div>
                  {getStatusBadge(email)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  To: {email.recipientEmail}
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Send className="w-3 h-3 mr-1" />
                    Sent {formatRelativeTime(email.sentAt)}
                  </div>
                  
                  {email.openedAt && (
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Opened {formatRelativeTime(email.openedAt)}
                    </div>
                  )}
                  
                  {email.clickCount > 0 && (
                    <div className="flex items-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      {email.clickCount} click{email.clickCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}