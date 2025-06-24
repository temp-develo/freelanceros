import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Send, 
  Download, 
  Link, 
  CheckCircle, 
  XCircle,
  Calendar,
  Loader2,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Proposal } from '@/types/proposals';
import { useUpdateProposal } from '@/hooks/useUpdateProposal';
import { useDeleteProposal } from '@/hooks/useDeleteProposal';
import { duplicateProposal } from '@/lib/proposals/duplicate';
import { generateProposalPDF } from '@/lib/proposals/pdf-generator';
import { generateShareLink, copyToClipboard } from '@/lib/proposals/share-link';
import { EmailCompositionModal } from './EmailCompositionModal';

interface ProposalActionsProps {
  proposal: Proposal;
  variant?: 'dropdown' | 'buttons';
  size?: 'sm' | 'default' | 'lg';
  onActionComplete?: () => void;
  className?: string;
}

export function ProposalActions({ 
  proposal, 
  variant = 'dropdown',
  size = 'default',
  onActionComplete,
  className
}: ProposalActionsProps) {
  const router = useRouter();
  const { 
    updateProposal, 
    sendProposal, 
    markAsAccepted, 
    markAsRejected, 
    loading: updateLoading 
  } = useUpdateProposal();
  const { deleteProposal, loading: deleteLoading } = useDeleteProposal();

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  // Loading states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  // Form states
  const [shareLink, setShareLink] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [duplicateTitle, setDuplicateTitle] = useState(`${proposal.title} (Copy)`);

  // Handle view action
  const handleView = () => {
    router.push(`/proposals/${proposal.id}`);
  };

  // Handle edit action
  const handleEdit = () => {
    router.push(`/proposals/${proposal.id}/edit`);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      await deleteProposal(proposal.id);
      toast.success('Proposal deleted successfully');
      setDeleteDialogOpen(false);
      onActionComplete?.();
      router.push('/proposals');
    } catch (error) {
      toast.error('Failed to delete proposal');
      console.error('Delete error:', error);
    }
  };

  // Handle export to PDF action
  const handleExportPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateProposalPDF(proposal);
      toast.success('PDF generated successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle share link generation
  const handleGenerateShareLink = async () => {
    try {
      setIsGeneratingLink(true);
      const link = await generateShareLink(proposal.id, expiryDays);
      setShareLink(link);
    } catch (error) {
      toast.error('Failed to generate share link');
      console.error('Share link error:', error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareLink);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Copy error:', error);
    }
  };

  // Handle duplicate proposal
  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true);
      const newProposalId = await duplicateProposal(proposal.id, duplicateTitle);
      toast.success('Proposal duplicated successfully');
      setDuplicateDialogOpen(false);
      router.push(`/proposals/${newProposalId}/edit`);
    } catch (error) {
      toast.error('Failed to duplicate proposal');
      console.error('Duplicate error:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  // Handle email send success
  const handleEmailSendSuccess = () => {
    toast.success('Email sent successfully');
    onActionComplete?.();
  };

  // Determine which actions are available based on proposal status
  const canEdit = proposal.status === 'draft';
  const canSend = proposal.status === 'draft';
  const canDelete = true; // Allow delete for all statuses
  const canDuplicate = true; // Allow duplicate for all statuses
  const canExport = true; // Allow export for all statuses
  const canShare = proposal.status !== 'draft'; // Only share non-draft proposals
  const canEmail = true; // Allow email for all statuses

  // Dropdown menu variant
  if (variant === 'dropdown') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size={size} 
              className={cn("", className)}
              aria-label="Proposal actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Proposal Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            
            {canEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            
            {canEmail && (
              <DropdownMenuItem onClick={() => setEmailDialogOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {canExport && (
              <DropdownMenuItem onClick={handleExportPDF} disabled={isGeneratingPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            )}
            
            {canShare && (
              <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                <Link className="mr-2 h-4 w-4" />
                Share Link
              </DropdownMenuItem>
            )}
            
            {canDuplicate && (
              <DropdownMenuItem onClick={() => setDuplicateDialogOpen(true)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {canDelete && (
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the proposal "{proposal.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Share Link Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Proposal</DialogTitle>
              <DialogDescription>
                Generate a shareable link to this proposal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Link Expiry</Label>
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
              </div>
              
              {!shareLink && (
                <Button 
                  onClick={handleGenerateShareLink}
                  disabled={isGeneratingLink}
                  className="w-full"
                >
                  {isGeneratingLink ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Link className="mr-2 h-4 w-4" />
                      Generate Link
                    </>
                  )}
                </Button>
              )}
              
              {shareLink && (
                <div className="space-y-2">
                  <Label htmlFor="share-link">Share Link</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="share-link" 
                      value={shareLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button onClick={handleCopyLink} size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This link will expire in {expiryDays} days.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Duplicate Proposal Dialog */}
        <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicate Proposal</DialogTitle>
              <DialogDescription>
                Create a copy of this proposal with a new title.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">New Proposal Title</Label>
                <Input 
                  id="title" 
                  value={duplicateTitle}
                  onChange={(e) => setDuplicateTitle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDuplicate}
                disabled={isDuplicating || !duplicateTitle.trim()}
              >
                {isDuplicating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Duplicating...
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Composition Modal */}
        <EmailCompositionModal
          proposal={proposal}
          isOpen={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          onSendSuccess={handleEmailSendSuccess}
        />
      </>
    );
  }

  // Button variant
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant="outline"
        size={size}
        onClick={handleView}
      >
        <Eye className="mr-2 h-4 w-4" />
        View
      </Button>
      
      {canEdit && (
        <Button
          variant="outline"
          size={size}
          onClick={handleEdit}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      )}
      
      {canEmail && (
        <Button
          variant="default"
          size={size}
          onClick={() => setEmailDialogOpen(true)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      )}
      
      {canExport && (
        <Button
          variant="outline"
          size={size}
          onClick={handleExportPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export PDF
        </Button>
      )}
      
      {canShare && (
        <Button
          variant="outline"
          size={size}
          onClick={() => setShareDialogOpen(true)}
        >
          <Link className="mr-2 h-4 w-4" />
          Share
        </Button>
      )}
      
      {canDuplicate && (
        <Button
          variant="outline"
          size={size}
          onClick={() => setDuplicateDialogOpen(true)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>
      )}
      
      {canDelete && (
        <Button
          variant="destructive"
          size={size}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}

      {/* Include all the same dialogs as in dropdown variant */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the proposal "{proposal.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Proposal</DialogTitle>
            <DialogDescription>
              Generate a shareable link to this proposal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiry</Label>
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
            </div>
            
            {!shareLink && (
              <Button 
                onClick={handleGenerateShareLink}
                disabled={isGeneratingLink}
                className="w-full"
              >
                {isGeneratingLink ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Generate Link
                  </>
                )}
              </Button>
            )}
            
            {shareLink && (
              <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="share-link" 
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleCopyLink} size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This link will expire in {expiryDays} days.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Proposal</DialogTitle>
            <DialogDescription>
              Create a copy of this proposal with a new title.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">New Proposal Title</Label>
              <Input 
                id="title" 
                value={duplicateTitle}
                onChange={(e) => setDuplicateTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDuplicate}
              disabled={isDuplicating || !duplicateTitle.trim()}
            >
              {isDuplicating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Composition Modal */}
      <EmailCompositionModal
        proposal={proposal}
        isOpen={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSendSuccess={handleEmailSendSuccess}
      />
    </div>
  );
}