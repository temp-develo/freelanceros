'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EmailHistoryList } from '@/components/proposals/EmailHistoryList';
import { EmailTrackingStats } from '@/components/proposals/EmailTrackingStats';
import { EmailCompositionModal } from '@/components/proposals/EmailCompositionModal';
import { useProposal } from '@/hooks/useProposal';
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  BarChart3, 
  Clock, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

export default function ProposalEmailsPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;
  
  const { proposal, loading, error, refetch } = useProposal(proposalId);
  const [activeTab, setActiveTab] = useState('history');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  
  // Handle send success
  const handleSendSuccess = () => {
    refetch();
  };
  
  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Error state
  if (error || !proposal) {
    return (
      <AppLayout>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Proposal</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {error?.message || 'The proposal could not be found or you do not have permission to view it.'}
              </p>
              <Button onClick={() => router.push('/proposals')}>
                Return to Proposals
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/proposals/${proposalId}`)}
                  className="mb-2 -ml-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Proposal
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Proposal Emails</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and track emails for "{proposal.title}"
                </p>
              </div>
              <Button onClick={() => setEmailModalOpen(true)}>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email History
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Tracking Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-6">
              <EmailHistoryList proposalId={proposalId} />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <EmailTrackingStats proposalId={proposalId} />
            </TabsContent>
          </Tabs>
          
          {/* Email Composition Modal */}
          <EmailCompositionModal
            proposal={proposal}
            isOpen={emailModalOpen}
            onOpenChange={setEmailModalOpen}
            onSendSuccess={handleSendSuccess}
          />
        </div>
      </div>
    </AppLayout>
  );
}