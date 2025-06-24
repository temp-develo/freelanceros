import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  FolderOpen,
  Activity,
  Target,
  Plus,
  ArrowRight,
  Lightbulb,
  Users,
  Clock,
  DollarSign,
  Send,
  Calendar,
  CheckCircle,
  Zap,
  Search,
  Filter,
  FileCheck,
  Briefcase,
  Mail
} from 'lucide-react'

// Base empty state component with consistent styling
interface BaseEmptyStateProps {
  className?: string
  children: React.ReactNode
}

function BaseEmptyState({ className, children }: BaseEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className
    )}>
      {children}
    </div>
  )
}

// Empty Proposals Component
interface EmptyProposalsProps {
  className?: string
  onCreateProposal?: () => void
  showCard?: boolean
}

function EmptyProposals({ 
  className, 
  onCreateProposal,
  showCard = true 
}: EmptyProposalsProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-blue-light/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-blue-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow/20 rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4 text-yellow" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No proposals yet
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Start winning clients by creating your first proposal. Showcase your skills, 
            set your rates, and turn prospects into paying customers.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onCreateProposal}
            className="bg-blue-light hover:bg-blue-light/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Proposal
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Takes less than 5 minutes to set up
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-4 h-4 text-yellow mr-2" />
            <span className="text-sm font-medium">Quick Tips</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Include detailed project scope and timeline
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Set clear pricing and payment terms
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Add portfolio samples to showcase your work
            </li>
          </ul>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Filtered Proposals Component
interface EmptyFilteredProposalsProps {
  className?: string
  filter?: string
  onClearFilter?: () => void
  showCard?: boolean
}

function EmptyFilteredProposals({ 
  className, 
  filter,
  onClearFilter,
  showCard = true 
}: EmptyFilteredProposalsProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-purple-light/10 rounded-full flex items-center justify-center mb-4">
          <Filter className="w-10 h-10 text-purple-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No matching proposals
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {filter 
              ? `No proposals match the "${filter}" filter. Try adjusting your filter criteria or create a new proposal.`
              : 'No proposals match your current filters. Try adjusting your filter criteria or create a new proposal.'}
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onClearFilter && (
            <Button 
              variant="outline"
              onClick={onClearFilter}
            >
              Clear Filters
            </Button>
          )}
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Proposal
          </Button>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Search Results Component
interface EmptySearchResultsProps {
  className?: string
  searchQuery: string
  onClearSearch?: () => void
  showCard?: boolean
}

function EmptySearchResults({ 
  className, 
  searchQuery,
  onClearSearch,
  showCard = true 
}: EmptySearchResultsProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-yellow/10 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-yellow" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No search results
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No proposals match your search for "<span className="font-medium text-foreground">{searchQuery}</span>". 
            Try using different keywords or check for typos.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onClearSearch && (
            <Button 
              variant="outline"
              onClick={onClearSearch}
            >
              Clear Search
            </Button>
          )}
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Proposal
          </Button>
        </div>

        {/* Search Tips */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-4 h-4 text-yellow mr-2" />
            <span className="text-sm font-medium">Search Tips</span>
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Try searching by client name, proposal title, or description
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Use shorter, more general terms
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Check for spelling mistakes
            </li>
          </ul>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// First Proposal Creation Guidance Component
interface FirstProposalGuidanceProps {
  className?: string
  onCreateProposal?: () => void
  showCard?: boolean
}

function FirstProposalGuidance({ 
  className, 
  onCreateProposal,
  showCard = true 
}: FirstProposalGuidanceProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-green-light/10 rounded-full flex items-center justify-center mb-4">
          <FileCheck className="w-10 h-10 text-green-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-light/20 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-blue-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Create your first winning proposal
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A great proposal is your first step to landing new clients. Follow our step-by-step guide to create 
            professional proposals that convert prospects into paying clients.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onCreateProposal}
            className="bg-green-light hover:bg-green-light/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Creating Now
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Our guided process makes it easy
          </div>
        </div>

        {/* Proposal Steps */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-blue-light mr-2" />
              <span className="font-medium">Client Information</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Start by adding your client's details and project requirements
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-purple-light mr-2" />
              <span className="font-medium">Project Scope</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Clearly define deliverables, timeline, and technical specifications
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-light mr-2" />
              <span className="font-medium">Pricing Strategy</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set competitive rates with clear payment terms and conditions
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-orange-light mr-2" />
              <span className="font-medium">Send & Track</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Send professionally formatted proposals and track client engagement
            </p>
          </div>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Projects Component
interface EmptyProjectsProps {
  className?: string
  onCreateProject?: () => void
  showCard?: boolean
}

function EmptyProjects({ 
  className, 
  onCreateProject,
  showCard = true 
}: EmptyProjectsProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-green-light/10 rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="w-10 h-10 text-green-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-light/20 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-blue-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to start your first project?
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Transform your accepted proposals into organized projects. Track progress, 
            manage deadlines, and deliver exceptional results for your clients.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onCreateProject}
            className="bg-green-light hover:bg-green-light/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Your First Project
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Organize your work and impress clients
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-orange-light mr-2" />
              <span className="text-xs font-medium">Time Tracking</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Track billable hours automatically
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Target className="w-4 h-4 text-purple-light mr-2" />
              <span className="text-xs font-medium">Milestones</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set and track project goals
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-light mr-2" />
              <span className="text-xs font-medium">Client Portal</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep clients updated
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-light mr-2" />
              <span className="text-xs font-medium">Invoicing</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate invoices easily
            </p>
          </div>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Activity Component
interface EmptyActivityProps {
  className?: string
  showCard?: boolean
}

function EmptyActivity({ 
  className,
  showCard = true 
}: EmptyActivityProps) {
  const content = (
    <BaseEmptyState className={cn("py-8", className)}>
      {/* Illustration */}
      <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="space-y-2 max-w-sm">
        <h4 className="text-lg font-medium text-foreground">
          No recent activity
        </h4>
        <p className="text-sm text-muted-foreground">
          Your recent business activities will appear here. Start by creating 
          proposals or projects to see your activity feed come to life.
        </p>
      </div>

      {/* Subtle CTA */}
      <div className="mt-6 flex items-center text-xs text-muted-foreground">
        <span>Activity updates automatically</span>
        <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Deadlines Component
interface EmptyDeadlinesProps {
  className?: string
  onCreateProject?: () => void
  showCard?: boolean
}

function EmptyDeadlines({ 
  className,
  onCreateProject,
  showCard = true 
}: EmptyDeadlinesProps) {
  const content = (
    <BaseEmptyState className={cn("py-8", className)}>
      {/* Illustration */}
      <div className="relative mb-4">
        <div className="w-16 h-16 mx-auto bg-green-light/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-sm">
        <h4 className="text-lg font-medium text-foreground">
          All caught up!
        </h4>
        <p className="text-sm text-muted-foreground">
          No upcoming deadlines at the moment. Your project milestones 
          and task deadlines will appear here when you have active work.
        </p>
      </div>

      {/* Optional CTA */}
      {onCreateProject && (
        <div className="mt-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCreateProject}
            className="text-xs"
          >
            <Calendar className="w-3 h-3 mr-2" />
            Create Project with Deadlines
          </Button>
        </div>
      )}
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed bg-green-light/5">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Clients Component
interface EmptyClientsProps {
  className?: string
  onAddClient?: () => void
  showCard?: boolean
}

function EmptyClients({ 
  className,
  onAddClient,
  showCard = true 
}: EmptyClientsProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-purple-light/10 rounded-full flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-purple-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-light/20 rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4 text-green-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Build your client base
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Add your first client to start building lasting business relationships. 
            Keep track of contact details, project history, and communication.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onAddClient}
            className="bg-purple-light hover:bg-purple-light/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Client
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Organize your business relationships
          </div>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Time Entries Component
interface EmptyTimeEntriesProps {
  className?: string
  onStartTimer?: () => void
  showCard?: boolean
}

function EmptyTimeEntries({ 
  className,
  onStartTimer,
  showCard = true 
}: EmptyTimeEntriesProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-orange-light/10 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-10 h-10 text-orange-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Start tracking your time
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Track billable hours accurately and generate detailed timesheets 
            for your clients. Never lose track of your valuable time again.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onStartTimer}
            className="bg-orange-light hover:bg-orange-light/90"
          >
            <Clock className="w-4 h-4 mr-2" />
            Start Your First Timer
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Accurate billing starts with good time tracking
          </div>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Empty Invoices Component
interface EmptyInvoicesProps {
  className?: string
  onCreateInvoice?: () => void
  showCard?: boolean
}

function EmptyInvoices({ 
  className,
  onCreateInvoice,
  showCard = true 
}: EmptyInvoicesProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 mx-auto bg-green-light/10 rounded-full flex items-center justify-center mb-4">
          <DollarSign className="w-10 h-10 text-green-light" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-light/20 rounded-full flex items-center justify-center">
          <Send className="w-4 h-4 text-blue-light" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Get paid for your work
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Create professional invoices and get paid faster. Track payment 
            status and send automated reminders to ensure timely payments.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button 
            onClick={onCreateInvoice}
            className="bg-green-light hover:bg-green-light/90"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Create Your First Invoice
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Professional invoicing made simple
          </div>
        </div>
      </div>
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Generic Empty State Component
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  showCard?: boolean
  iconColor?: string
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  showCard = true,
  iconColor = "text-muted-foreground"
}: EmptyStateProps) {
  const content = (
    <BaseEmptyState className={className}>
      {/* Icon */}
      <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Icon className={cn("w-8 h-8", iconColor)} />
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-sm">
        <h4 className="text-lg font-medium text-foreground">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Action */}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="outline" size="sm">
            {actionLabel}
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </div>
      )}
    </BaseEmptyState>
  )

  if (showCard) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Export all components
export {
  BaseEmptyState,
  EmptyProposals,
  EmptyFilteredProposals,
  EmptySearchResults,
  FirstProposalGuidance,
  EmptyProjects,
  EmptyActivity,
  EmptyDeadlines,
  EmptyClients,
  EmptyTimeEntries,
  EmptyInvoices,
  EmptyState
}