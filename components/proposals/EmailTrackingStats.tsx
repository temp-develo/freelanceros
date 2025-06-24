'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProposalEmailStats } from '@/lib/proposals/email-sender';
import { 
  Mail, 
  Eye, 
  MousePointer, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface EmailTrackingStatsProps {
  proposalId: string;
  className?: string;
}

interface EmailStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
  averageTimeToOpen: number; // in minutes
  lastSentAt: string | null;
  lastOpenedAt: string | null;
}

export function EmailTrackingStats({ proposalId, className }: EmailTrackingStatsProps) {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const emailStats = await getProposalEmailStats(proposalId);
      setStats(emailStats);
    } catch (error) {
      console.error('Error fetching email stats:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch email stats'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, [proposalId]);
  
  // Format time to human-readable format
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} minutes`;
    } else if (minutes < 1440) {
      return `${Math.round(minutes / 60)} hours`;
    } else {
      return `${Math.round(minutes / 1440)} days`;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Email Tracking
          </CardTitle>
          <CardDescription>
            Email engagement statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
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
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Email Tracking
          </CardTitle>
          <CardDescription>
            Email engagement statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mb-2" />
            <h3 className="font-medium mb-1">Failed to load email statistics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // No data state
  if (!stats || stats.totalSent === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Email Tracking
          </CardTitle>
          <CardDescription>
            Email engagement statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Mail className="w-10 h-10 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">No email data yet</h3>
            <p className="text-sm text-muted-foreground">
              Send your first email to start tracking engagement.
            </p>
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
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Email Tracking
            </CardTitle>
            <CardDescription>
              Email engagement statistics
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{stats.totalSent}</div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{stats.totalOpened}</div>
            <div className="text-sm text-muted-foreground">Emails Opened</div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <MousePointer className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold">{stats.totalClicked}</div>
            <div className="text-sm text-muted-foreground">Links Clicked</div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Open Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Open Rate</div>
              <Badge variant="outline" className="font-mono">
                {stats.openRate}%
              </Badge>
            </div>
            <Progress value={stats.openRate} className="h-2" />
          </div>
          
          {/* Click Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Click Rate</div>
              <Badge variant="outline" className="font-mono">
                {stats.clickRate}%
              </Badge>
            </div>
            <Progress value={stats.clickRate} className="h-2" />
          </div>
          
          {/* Average Time to Open */}
          {stats.averageTimeToOpen > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Average Time to Open</span>
              </div>
              <span>{formatTime(stats.averageTimeToOpen)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}