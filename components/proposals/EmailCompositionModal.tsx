'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Proposal } from '@/types/proposals';
import { sendProposalEmail } from '@/lib/proposals/email-sender';
import { 
  Loader2, 
  Send, 
  Mail, 
  FileText, 
  Eye, 
  Settings, 
  Clock,
  CheckCircle,
  Copy,
  Sparkles
} from 'lucide-react';

interface EmailCompositionModalProps {
  proposal: Proposal;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendSuccess: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

// Sample email templates
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Proposal',
    subject: 'Your Proposal: {proposalTitle}',
    body: `Dear {clientName},

I'm pleased to share this proposal with you for {proposalTitle}. Please review it at your earliest convenience.

You can view the full proposal by clicking the link below. The proposal includes detailed information about the project scope, timeline, and pricing.

If you have any questions or would like to discuss any aspect of the proposal, please don't hesitate to reach out.

Best regards,
{userName}`
  },
  {
    id: 'follow-up',
    name: 'Follow-up',
    subject: 'Following up on your proposal: {proposalTitle}',
    body: `Dear {clientName},

I wanted to follow up on the proposal I sent you for {proposalTitle}. I hope you've had a chance to review it.

If you have any questions or would like to discuss any aspect of the proposal, I'm available to chat at your convenience.

You can view the proposal again by clicking the link below.

Looking forward to your feedback.

Best regards,
{userName}`
  },
  {
    id: 'urgent',
    name: 'Urgent - Expiring Soon',
    subject: 'URGENT: Your proposal is expiring soon - {proposalTitle}',
    body: `Dear {clientName},

This is a friendly reminder that the proposal I sent you for {proposalTitle} will expire soon.

To ensure you don't miss out on the terms and pricing outlined in the proposal, please review and respond at your earliest convenience.

You can view the proposal by clicking the link below.

If you need more time or have any questions, please let me know.

Best regards,
{userName}`
  }
];

export function EmailCompositionModal({
  proposal,
  isOpen,
  onOpenChange,
  onSendSuccess
}: EmailCompositionModalProps) {
  // Form state
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeAttachment, setIncludeAttachment] = useState(true);
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [expiryDays, setExpiryDays] = useState(30);
  
  // Loading state
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Set initial values based on proposal
  useEffect(() => {
    if (proposal && isOpen) {
      // Default recipient email (in a real app, this would come from the client record)
      setRecipientEmail(proposal.clientName ? `${proposal.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com` : '');
      
      // Apply the standard template
      applyTemplate('standard');
    }
  }, [proposal, isOpen]);
  
  // Apply email template
  const applyTemplate = (templateId: string) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    setSelectedTemplate(templateId);
    
    // Replace placeholders in subject
    let processedSubject = template.subject
      .replace('{proposalTitle}', proposal.title)
      .replace('{clientName}', proposal.clientName);
    
    // Replace placeholders in body
    let processedBody = template.body
      .replace(/{proposalTitle}/g, proposal.title)
      .replace(/{clientName}/g, proposal.clientName)
      .replace(/{userName}/g, 'Your Name'); // In a real app, this would be the user's name
    
    setSubject(processedSubject);
    setMessage(processedBody);
  };
  
  // Generate preview URL
  useEffect(() => {
    if (proposal) {
      // In a real app, this would be a real preview URL
      setPreviewUrl(`${window.location.origin}/proposals/share/preview-${proposal.id}`);
    }
  }, [proposal]);
  
  // Copy preview URL to clipboard
  const copyPreviewUrl = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      toast.success('Preview URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };
  
  // Handle send email
  const handleSendEmail = async () => {
    try {
      // Validate form
      if (!recipientEmail) {
        toast.error('Recipient email is required');
        return;
      }
      
      if (!subject) {
        toast.error('Subject is required');
        return;
      }
      
      if (!message) {
        toast.error('Message is required');
        return;
      }
      
      setIsSending(true);
      
      // Send the email
      await sendProposalEmail({
        to: recipientEmail,
        cc: ccEmail || undefined,
        subject,
        message,
        proposalId: proposal.id,
        proposalTitle: proposal.title,
        clientName: proposal.clientName,
        includeAttachment,
        trackOpens,
        trackClicks,
        expiryDays
      });
      
      toast.success('Proposal email sent successfully');
      onSendSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };
  
  // Generate email with AI
  const generateEmailWithAI = async () => {
    try {
      toast.info('Generating email content...', {
        duration: 2000
      });
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Apply a template with some variations
      const templates = ['standard', 'follow-up', 'urgent'];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      applyTemplate(randomTemplate);
      
      toast.success('Email content generated');
    } catch (error) {
      toast.error('Failed to generate email content');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Send Proposal Email
          </DialogTitle>
          <DialogDescription>
            Compose and send an email with your proposal to {proposal?.clientName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Compose</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-4">
                {/* Email Template Selector */}
                <div className="space-y-2">
                  <Label htmlFor="template">Email Template</Label>
                  <Select value={selectedTemplate} onValueChange={applyTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_TEMPLATES.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">To</Label>
                  <Input
                    id="recipient"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                
                {/* CC */}
                <div className="space-y-2">
                  <Label htmlFor="cc">CC (Optional)</Label>
                  <Input
                    id="cc"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    placeholder="cc@example.com"
                  />
                </div>
                
                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">Message</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateEmailWithAI}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4 py-4">
            <div className="border rounded-md p-4 space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">From: Your Name &lt;your.email@example.com&gt;</div>
                <div className="text-sm text-muted-foreground">To: {recipientEmail}</div>
                {ccEmail && <div className="text-sm text-muted-foreground">CC: {ccEmail}</div>}
                <div className="text-sm text-muted-foreground">Subject: {subject}</div>
              </div>
              
              <div className="border-t pt-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  
                  {/* Preview of proposal link */}
                  <div className="my-4 p-4 border rounded-md bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">View Proposal</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyPreviewUrl}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 underline break-all">
                      {previewUrl}
                    </div>
                  </div>
                  
                  {includeAttachment && (
                    <div className="my-4 p-4 border rounded-md bg-muted/30">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium">Proposal_{proposal.title.replace(/\s+/g, '_')}.pdf</span>
                      </div>
                    </div>
                  )}
                  
                  <p>Best regards,<br />Your Name</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-attachment" 
                  checked={includeAttachment}
                  onCheckedChange={(checked) => setIncludeAttachment(checked as boolean)}
                />
                <Label htmlFor="include-attachment">Include PDF attachment</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="track-opens" 
                  checked={trackOpens}
                  onCheckedChange={(checked) => setTrackOpens(checked as boolean)}
                />
                <Label htmlFor="track-opens">Track email opens</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="track-clicks" 
                  checked={trackClicks}
                  onCheckedChange={(checked) => setTrackClicks(checked as boolean)}
                />
                <Label htmlFor="track-clicks">Track link clicks</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Link expiry</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="expiry"
                    type="number"
                    min={1}
                    max={90}
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span>days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The proposal link will expire after this many days.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !recipientEmail || !subject || !message}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}