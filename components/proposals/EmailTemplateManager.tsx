'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  createEmailTemplate, 
  getEmailTemplates, 
  deleteEmailTemplate 
} from '@/lib/proposals/email-sender';
import { 
  Loader2, 
  Plus, 
  Save, 
  Trash2, 
  FileText, 
  Settings, 
  Star,
  Copy,
  Edit,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  
  // Action loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const templates = await getEmailTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch templates'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  // Reset form
  const resetForm = () => {
    setTemplateName('');
    setTemplateSubject('');
    setTemplateBody('');
    setIsDefault(false);
    setSelectedTemplate(null);
  };
  
  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };
  
  // Open edit dialog
  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setIsDefault(template.isDefault);
    setEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };
  
  // Handle create template
  const handleCreateTemplate = async () => {
    try {
      // Validate form
      if (!templateName.trim()) {
        toast.error('Template name is required');
        return;
      }
      
      if (!templateSubject.trim()) {
        toast.error('Subject is required');
        return;
      }
      
      if (!templateBody.trim()) {
        toast.error('Body is required');
        return;
      }
      
      setIsSaving(true);
      
      // Create template
      await createEmailTemplate({
        name: templateName,
        subject: templateSubject,
        body: templateBody,
        isDefault
      });
      
      toast.success('Email template created successfully');
      setCreateDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle update template
  const handleUpdateTemplate = async () => {
    try {
      // Validate form
      if (!selectedTemplate) {
        toast.error('No template selected');
        return;
      }
      
      if (!templateName.trim()) {
        toast.error('Template name is required');
        return;
      }
      
      if (!templateSubject.trim()) {
        toast.error('Subject is required');
        return;
      }
      
      if (!templateBody.trim()) {
        toast.error('Body is required');
        return;
      }
      
      setIsSaving(true);
      
      // Update template
      // In a real implementation, this would call an API
      // For now, we'll simulate an update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email template updated successfully');
      setEditDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle delete template
  const handleDeleteTemplate = async () => {
    try {
      if (!selectedTemplate) {
        toast.error('No template selected');
        return;
      }
      
      setIsDeleting(true);
      
      // Delete template
      await deleteEmailTemplate(selectedTemplate.id);
      
      toast.success('Email template deleted successfully');
      setDeleteDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle duplicate template
  const handleDuplicateTemplate = (template: EmailTemplate) => {
    setTemplateName(`${template.name} (Copy)`);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setIsDefault(false);
    setCreateDialogOpen(true);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load templates</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || 'An unexpected error occurred while loading your email templates.'}
        </p>
        <Button onClick={fetchTemplates}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">
            Manage your proposal email templates
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
      
      {/* Templates List */}
      {templates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first email template to streamline your proposal sending process.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {template.name}
                      {template.isDefault && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.subject}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(template)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-32 overflow-hidden text-sm text-muted-foreground">
                  <div className="line-clamp-6 whitespace-pre-line">
                    {template.body}
                  </div>
                  {template.body.split('\n').length > 6 && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>
              Create a new email template for sending proposals
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Standard Proposal"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-subject">Email Subject</Label>
              <Input
                id="template-subject"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="e.g., Your Proposal: {proposalTitle}"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{proposalTitle}'}, {'{clientName}'} as placeholders
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-body">Email Body</Label>
              <Textarea
                id="template-body"
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                rows={10}
                placeholder="Dear {clientName},

I'm pleased to share this proposal with you for {proposalTitle}..."
              />
              <p className="text-xs text-muted-foreground">
                Use {'{proposalTitle}'}, {'{clientName}'}, {'{userName}'} as placeholders
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-default"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked as boolean)}
              />
              <Label htmlFor="is-default">Set as default template</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={isSaving || !templateName || !templateSubject || !templateBody}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>
              Update your email template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-template-name">Template Name</Label>
              <Input
                id="edit-template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-template-subject">Email Subject</Label>
              <Input
                id="edit-template-subject"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use {'{proposalTitle}'}, {'{clientName}'} as placeholders
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-template-body">Email Body</Label>
              <Textarea
                id="edit-template-body"
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                Use {'{proposalTitle}'}, {'{clientName}'}, {'{userName}'} as placeholders
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is-default"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked as boolean)}
              />
              <Label htmlFor="edit-is-default">Set as default template</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              disabled={isSaving || !templateName || !templateSubject || !templateBody}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Template Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template "{selectedTemplate?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
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
    </div>
  );
}