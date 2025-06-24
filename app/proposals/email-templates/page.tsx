'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { EmailTemplateManager } from '@/components/proposals/EmailTemplateManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Mail, 
  Settings, 
  Sparkles, 
  Lightbulb
} from 'lucide-react';

export default function EmailTemplatesPage() {
  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
                <p className="text-muted-foreground mt-2">
                  Create and manage email templates for sending proposals
                </p>
              </div>
            </div>
          </div>
          
          {/* Tips Card */}
          <Card className="mb-8 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                <Lightbulb className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Email Template Tips
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-400">
                Best practices for creating effective proposal emails
              </CardDescription>
            </CardHeader>
            <CardContent className="text-blue-700 dark:text-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Available Placeholders</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded mr-2">{'{clientName}'}</span>
                      <span>Client's name</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded mr-2">{'{proposalTitle}'}</span>
                      <span>Proposal title</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded mr-2">{'{userName}'}</span>
                      <span>Your name</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Writing Effective Emails</h3>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>Keep your emails concise and to the point</li>
                    <li>Personalize the content for each client</li>
                    <li>Highlight key benefits of your proposal</li>
                    <li>Include a clear call-to-action</li>
                    <li>Use a professional tone and check for errors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Template Manager */}
          <EmailTemplateManager />
        </div>
      </div>
    </AppLayout>
  );
}