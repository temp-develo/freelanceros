'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Settings,
  Trash2,
  Download,
  Upload,
  Save,
  Mail,
  User,
  MessageSquare,
  Send,
} from 'lucide-react';

export default function FeedbackShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [progress1, setProgress1] = useState(33);
  const [progress2, setProgress2] = useState(67);
  const [progress3, setProgress3] = useState(89);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form submitted successfully!', {
      description: `Thank you ${formData.name}, we'll get back to you soon.`,
    });
    setDialogOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleDeleteConfirm = () => {
    toast.error('Project deleted', {
      description: 'The project has been permanently deleted.',
    });
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Upload completed!', {
            description: 'Your file has been uploaded successfully.',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const showToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        toast.success('Success!', {
          description: 'Your action was completed successfully.',
        });
        break;
      case 'error':
        toast.error('Error occurred', {
          description: 'Something went wrong. Please try again.',
        });
        break;
      case 'info':
        toast.info('Information', {
          description: 'Here is some useful information for you.',
        });
        break;
      case 'warning':
        toast.warning('Warning', {
          description: 'Please review this action before proceeding.',
        });
        break;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Feedback Components Showcase
          </h1>
          <p className="text-base-500 text-lg">
            Interactive feedback components including dialogs, alerts, toasts, and progress indicators
          </p>
        </div>

        <Separator />

        {/* Dialog Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Dialog Components</h2>
            <p className="text-muted-foreground">
              Modal dialogs for forms, settings, and other interactive content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Form Dialog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-light" />
                  Contact Form Dialog
                </CardTitle>
                <CardDescription>Modal with form validation</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Contact Form
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact Us</DialogTitle>
                      <DialogDescription>
                        Send us a message and we'll get back to you as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Input
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Your message..."
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Settings Dialog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-light" />
                  Settings Dialog
                </CardTitle>
                <CardDescription>Configuration modal</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Open Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Project Settings</DialogTitle>
                      <DialogDescription>
                        Configure your project preferences and settings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input id="project-name" defaultValue="FreelancerOS Dashboard" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Project description..." />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <Badge variant="secondary">Enabled</Badge>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => toast.success('Settings saved!')}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* User Profile Dialog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-light" />
                  Profile Dialog
                </CardTitle>
                <CardDescription>User profile modal</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information and preferences.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" placeholder="Tell us about yourself..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => toast.success('Profile updated!')}>
                        Update Profile
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Alert Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Alert Components</h2>
            <p className="text-muted-foreground">
              Static alerts for displaying important information and status messages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Information Alerts</h3>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is a general information alert. Use it to provide helpful context or tips.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-light/20 bg-green-light/5">
                <CheckCircle className="h-4 w-4 text-green-light" />
                <AlertTitle className="text-green-light">Success</AlertTitle>
                <AlertDescription>
                  Your project has been successfully created and is ready for development.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Warning & Error Alerts</h3>
              
              <Alert className="border-orange-light/20 bg-orange-light/5">
                <AlertTriangle className="h-4 w-4 text-orange-light" />
                <AlertTitle className="text-orange-light">Warning</AlertTitle>
                <AlertDescription>
                  Your subscription will expire in 3 days. Please renew to continue using all features.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to save changes. Please check your connection and try again.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        <Separator />

        {/* Alert Dialog Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Alert Dialog Components</h2>
            <p className="text-muted-foreground">
              Confirmation dialogs for destructive or important actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Trash2 className="w-5 h-5 mr-2 text-red-light" />
                  Delete Confirmation
                </CardTitle>
                <CardDescription>Destructive action confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your project
                        and remove all associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Project
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-light" />
                  Download Confirmation
                </CardTitle>
                <CardDescription>Action confirmation dialog</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Download Project Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will download all your project data including files, settings, and history.
                        The download may take a few minutes to prepare.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.info('Download started', { description: 'Your download will begin shortly.' })}>
                        Start Download
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-light" />
                  Reset Settings
                </CardTitle>
                <CardDescription>Settings reset confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Reset Settings
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset All Settings</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all your preferences to default values. You can always
                        reconfigure them later, but your current settings will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Settings</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success('Settings reset to defaults')}>
                        Reset Settings
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Toast Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Toast Notifications</h2>
            <p className="text-muted-foreground">
              Temporary notifications that appear and disappear automatically
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => showToast('success')}
              className="bg-green-light hover:bg-green-light/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Success Toast
            </Button>
            
            <Button
              onClick={() => showToast('error')}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Error Toast
            </Button>
            
            <Button
              onClick={() => showToast('info')}
              className="bg-blue-light hover:bg-blue-light/90"
            >
              <Info className="w-4 h-4 mr-2" />
              Info Toast
            </Button>
            
            <Button
              onClick={() => showToast('warning')}
              className="bg-orange-light hover:bg-orange-light/90"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Warning Toast
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Toast Features</CardTitle>
              <CardDescription>Key features of the toast notification system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-light" />
                    Auto Dismiss
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Toasts automatically disappear after a few seconds
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Info className="w-4 h-4 mr-2 text-blue-light" />
                    Rich Content
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Support for titles, descriptions, and actions
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-purple-light" />
                    Positioning
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Configurable positioning and stacking
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-light" />
                    Multiple Types
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Success, error, info, and warning variants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Progress Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Progress Components</h2>
            <p className="text-muted-foreground">
              Progress indicators for showing completion status and loading states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Static Progress Bars</CardTitle>
                <CardDescription>Fixed progress values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Setup</span>
                    <span>{progress1}%</span>
                  </div>
                  <Progress value={progress1} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Development</span>
                    <span>{progress2}%</span>
                  </div>
                  <Progress value={progress2} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testing & QA</span>
                    <span>{progress3}%</span>
                  </div>
                  <Progress value={progress3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive Progress</CardTitle>
                <CardDescription>Dynamic progress simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>File Upload</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-3" />
                  </div>
                  
                  <Button 
                    onClick={simulateUpload} 
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadProgress === 0 ? 'Start Upload' : 
                     uploadProgress === 100 ? 'Upload Complete' : 
                     'Uploading...'}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Progress Controls</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setProgress1(Math.min(100, progress1 + 10))}
                    >
                      +10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setProgress2(Math.min(100, progress2 + 10))}
                    >
                      +10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setProgress3(Math.min(100, progress3 + 10))}
                    >
                      +10%
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Variants</CardTitle>
              <CardDescription>Different progress bar styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Small Progress (h-1)</Label>
                <Progress value={45} className="h-1" />
              </div>
              
              <div className="space-y-2">
                <Label>Default Progress (h-2)</Label>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <Label>Large Progress (h-4)</Label>
                <Progress value={85} className="h-4" />
              </div>
              
              <div className="space-y-2">
                <Label>Custom Colored Progress</Label>
                <Progress 
                  value={75} 
                  className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-blue-light [&>div]:to-purple-light" 
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-base-950/50 to-base-900/50 border-base-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Feedback Components Summary
              </CardTitle>
              <CardDescription className="text-base">
                Complete feedback system for user interactions and status communication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-light">Dialog</div>
                  <div className="text-sm text-muted-foreground">Modal interactions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-light">Alert</div>
                  <div className="text-sm text-muted-foreground">Status messages</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-light">AlertDialog</div>
                  <div className="text-sm text-muted-foreground">Confirmations</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-light">Toast</div>
                  <div className="text-sm text-muted-foreground">Notifications</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-light">Progress</div>
                  <div className="text-sm text-muted-foreground">Loading states</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}