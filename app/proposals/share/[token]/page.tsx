'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ProposalStatusBadge } from '@/components/proposals/ProposalStatusBadge';
import { validateShareLink } from '@/lib/proposals/share-link';
import { sendProposalResponseNotification } from '@/lib/proposals/email-sender';
import { useProposal } from '@/hooks/useProposal';
import { useUpdateProposal } from '@/hooks/useUpdateProposal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  FileText, 
  User, 
  Building, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertTriangle, 
  Lock, 
  Download,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProposalSharePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { proposal, loading, error } = useProposal(proposalId);
  const { markAsAccepted, markAsRejected } = useUpdateProposal();
  
  // Validate the token on mount
  useEffect(() => {
    const validate = async () => {
      try {
        setIsValidating(true);
        const result = await validateShareLink(token);
        
        setIsValidToken(result.valid);
        setIsExpired(result.expired || false);
        
        if (result.valid && result.proposalId) {
          setProposalId(result.proposalId);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };
    
    validate();
  }, [token]);
  
  // Handle accept proposal
  const handleAccept = async () => {
    if (!proposal) return;
    
    try {
      setIsSubmitting(true);
      await markAsAccepted(proposal.id);
      
      // Send notification to proposal creator
      await sendProposalResponseNotification(
        proposal.id,
        'accepted',
        responseMessage
      );
      
      toast.success('Proposal accepted successfully');
      
      // Refresh the proposal data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Failed to accept proposal');
      console.error('Accept error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle reject proposal
  const handleReject = async () => {
    if (!proposal) return;
    
    try {
      setIsSubmitting(true);
      await markAsRejected(proposal.id);
      
      // Send notification to proposal creator
      await sendProposalResponseNotification(
        proposal.id,
        'rejected',
        responseMessage
      );
      
      toast.success('Proposal rejected successfully');
      
      // Refresh the proposal data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Failed to reject proposal');
      console.error('Reject error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Validating Link</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we validate this proposal link...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Invalid Link</h3>
              <p className="text-sm text-muted-foreground">
                {isExpired 
                  ? 'This proposal link has expired. Please contact the sender for a new link.'
                  : 'This proposal link is invalid or has been revoked. Please contact the sender for assistance.'}
              </p>
            </div>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Proposal loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Loading Proposal</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we load the proposal details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error state
  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Error Loading Proposal</h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'An unexpected error occurred. Please try again later.'}
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if proposal is already accepted or rejected
  const isResponded = proposal.status === 'accepted' || proposal.status === 'rejected';
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-primary/10">
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
                  <Badge variant="outline" className="whitespace-nowrap">
                    <Calendar className="w-3 h-3 mr-1" />
                    Valid until {formatDate(proposal.validUntil)}
                  </Badge>
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
                
                {/* Response Section */}
                {!isResponded && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Your Response</h3>
                    
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add a message with your response (optional)"
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        rows={3}
                      />
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
                          onClick={handleReject}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ThumbsDown className="mr-2 h-4 w-4" />
                          )}
                          Decline Proposal
                        </Button>
                        
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                          onClick={handleAccept}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ThumbsUp className="mr-2 h-4 w-4" />
                          )}
                          Accept Proposal
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Response Status */}
                {isResponded && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Response Status</h3>
                    
                    <Alert variant={proposal.status === 'accepted' ? 'default' : 'destructive'}>
                      {proposal.status === 'accepted' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {proposal.status === 'accepted' ? 'Proposal Accepted' : 'Proposal Declined'}
                      </AlertTitle>
                      <AlertDescription>
                        {proposal.status === 'accepted' 
                          ? 'You have accepted this proposal. The sender has been notified.'
                          : 'You have declined this proposal. The sender has been notified.'}
                        {proposal.respondedAt && (
                          <div className="mt-2 text-xs">
                            Responded on {formatDate(proposal.respondedAt)}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
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
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            This is a secure proposal viewing page. If you have any questions, please contact the sender directly.
          </p>
        </div>
      </div>
    </div>
  );
}