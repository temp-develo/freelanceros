'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProposalStatusBadge, ProposalValidity } from '@/components/proposals/ProposalStatusBadge';
import { ProposalActions } from '@/components/proposals/ProposalActions';
import { useProposal } from '@/hooks/useProposal';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Loader2, 
  Send, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Download
} from 'lucide-react';

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;
  
  const { proposal, loading, error, refetch } = useProposal(proposalId);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle action complete (refresh data)
  const handleActionComplete = () => {
    refetch();
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-blue-600">Loading proposal...</span>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !proposal) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/proposals')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Proposals
          </Button>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error Loading Proposal</h2>
                <p className="text-muted-foreground mb-6">
                  {error?.message || 'The proposal could not be found or you do not have permission to view it.'}
                </p>
                <Button onClick={() => router.push('/proposals')}>
                  Return to Proposals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/proposals')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Proposals
          </Button>
          
          <ProposalActions 
            proposal={proposal} 
            variant="buttons"
            onActionComplete={handleActionComplete}
          />
        </div>
        
        {/* Proposal Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">{proposal.title}</CardTitle>
                <CardDescription>
                  Proposal for {proposal.clientName}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ProposalStatusBadge status={proposal.status} size="lg" />
                {proposal.validUntil && (
                  <ProposalValidity validUntil={proposal.validUntil} />
                )}
              </div>
            </div>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-6">
              <TabsContent value="overview" className="space-y-6">
                {/* Proposal Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Proposal Summary</h3>
                  
                  {proposal.description && (
                    <div className="text-sm">
                      {proposal.description}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Total Value</div>
                        <div className="text-lg font-bold">
                          {formatCurrency(proposal.amount, proposal.currency)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Created On</div>
                        <div>{formatDate(proposal.createdAt)}</div>
                      </div>
                    </div>
                    
                    {proposal.sentAt && (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Sent On</div>
                          <div>{formatDate(proposal.sentAt)}</div>
                        </div>
                      </div>
                    )}
                    
                    {proposal.validUntil && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Valid Until</div>
                          <div>{formatDate(proposal.validUntil)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Client Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${proposal.clientName}`} />
                        <AvatarFallback className="text-lg">
                          {getInitials(proposal.clientName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-medium">{proposal.clientName}</h4>
                      <p className="text-sm text-muted-foreground">Client</p>
                    </div>
                  </div>
                </div>
                
                {/* Status Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <FileText className="w-3 h-3 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(proposal.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Proposal created and saved as draft
                        </p>
                      </div>
                    </div>
                    
                    {proposal.sentAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <Send className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Sent</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(proposal.sentAt)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Proposal sent to client
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {proposal.viewedAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                          <Eye className="w-3 h-3 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Viewed</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(proposal.viewedAt)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client viewed the proposal
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {proposal.respondedAt && (
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${
                          proposal.status === 'accepted' 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        } flex items-center justify-center mt-0.5`}>
                          {proposal.status === 'accepted' ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {proposal.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(proposal.respondedAt)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client {proposal.status === 'accepted' ? 'accepted' : 'rejected'} the proposal
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                {/* Proposal Sections */}
                {proposal.sections && proposal.sections.length > 0 && (
                  <div className="space-y-6">
                    {proposal.sections.map((section) => (
                      <div key={section.id} className="space-y-3">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.content && (
                          <div className="text-sm whitespace-pre-line">
                            {section.content}
                          </div>
                        )}
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Proposal Items */}
                {proposal.items && proposal.items.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pricing Details</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-right">Quantity</th>
                            <th className="px-4 py-2 text-right">Unit Price</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposal.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="px-4 py-3">{item.description}</td>
                              <td className="px-4 py-3 text-right">{item.quantity}</td>
                              <td className="px-4 py-3 text-right">
                                {formatCurrency(item.unitPrice, proposal.currency)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {formatCurrency(item.amount, proposal.currency)}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-bold">
                            <td colSpan={3} className="px-4 py-3 text-right">Total:</td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(proposal.amount, proposal.currency)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Download PDF */}
                <div className="flex justify-center pt-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}