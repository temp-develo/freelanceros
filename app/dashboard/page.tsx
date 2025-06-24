'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  StatCardSkeleton,
  ActivityItemSkeleton,
  DeadlineItemSkeleton,
} from '@/components/ui/dashboard-skeletons'
import {
  EmptyActivity,
  EmptyDeadlines,
} from '@/components/ui/empty-states'
import {
  FolderOpen,
  FileText,
  DollarSign,
  Clock,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react'

// Quick actions data
const quickActions = [
  {
    title: 'New Proposal',
    description: 'Create a new project proposal',
    icon: FileText,
    color: 'blue',
    action: 'create_proposal'
  },
  {
    title: 'New Project',
    description: 'Start a new client project',
    icon: FolderOpen,
    color: 'green',
    action: 'create_project'
  },
  {
    title: 'Generate Invoice',
    description: 'Create and send invoice',
    icon: DollarSign,
    color: 'orange',
    action: 'create_invoice'
  },
  {
    title: 'Time Tracking',
    description: 'Start tracking your time',
    icon: Clock,
    color: 'purple',
    action: 'start_timer'
  }
]

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'proposal_sent':
      return FileText
    case 'project_completed':
    case 'milestone_reached':
      return CheckCircle
    case 'payment_received':
      return DollarSign
    case 'meeting_scheduled':
      return Calendar
    case 'invoice_sent':
      return FileText
    case 'project_started':
      return FolderOpen
    default:
      return Activity
  }
}

// Helper function to get activity color
const getActivityColor = (type: string) => {
  switch (type) {
    case 'proposal_sent':
      return 'blue'
    case 'project_completed':
    case 'milestone_reached':
    case 'payment_received':
      return 'green'
    case 'meeting_scheduled':
      return 'purple'
    case 'invoice_sent':
      return 'orange'
    case 'project_started':
      return 'blue'
    default:
      return 'gray'
  }
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Helper function to format time ago
const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return time.toLocaleDateString()
}

// Helper function to get days until deadline
const getDaysUntilDeadline = (dueDate: string) => {
  const now = new Date()
  const deadline = new Date(dueDate)
  const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays
}

export default function DashboardPage() {
  // Use the combined dashboard hook with real-time updates
  const {
    stats,
    activity,
    deadlines,
    realtime,
    isLoading,
    hasError,
    refetchAll
  } = useDashboard()

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`)
    // TODO: Implement actual actions
  }

  const handleRetry = async () => {
    await refetchAll()
  }

  // Empty state handlers
  const handleCreateProposal = () => {
    console.log('Create proposal clicked')
    // TODO: Navigate to proposal creation
  }

  const handleCreateProject = () => {
    console.log('Create project clicked')
    // TODO: Navigate to project creation
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Real-time Status Indicator */}
      <div className="flex items-center gap-2">
        {realtime.isConnected ? (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Wifi className="w-3 h-3" />
            <span className="hidden sm:inline">Live</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <WifiOff className="w-3 h-3" />
            <span className="hidden sm:inline">Offline</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <AppLayout headerActions={headerActions}>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Here's what's happening with your freelance business.
                </p>
              </div>
              {/* Real-time Status */}
              <div className="flex items-center gap-2 text-sm">
                {realtime.isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live updates active</span>
                    <Badge variant="outline" className="text-xs">
                      {realtime.activeSubscriptions} subscriptions
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Offline mode</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error State */}
          {hasError && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load dashboard data. Please try again.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.loading ? (
              // Show skeleton loading state
              Array.from({ length: 4 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            ) : stats.data ? (
              // Show actual stats cards
              [
                {
                  title: 'Active Projects',
                  value: stats.data.activeProjects.toString(),
                  change: stats.data.activeProjectsChange,
                  icon: FolderOpen,
                  color: 'blue'
                },
                {
                  title: 'Pending Proposals',
                  value: stats.data.pendingProposals.toString(),
                  change: stats.data.pendingProposalsChange,
                  icon: FileText,
                  color: 'purple'
                },
                {
                  title: 'This Month Revenue',
                  value: formatCurrency(stats.data.monthlyRevenue),
                  change: stats.data.monthlyRevenueChange,
                  icon: DollarSign,
                  color: 'green'
                },
                {
                  title: 'Hours Tracked',
                  value: `${stats.data.hoursTracked}h`,
                  change: stats.data.hoursTrackedChange,
                  icon: Clock,
                  color: 'orange'
                }
              ].map((card, index) => (
                <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-${card.color}-light/10 group-hover:bg-${card.color}-light/20 transition-colors`}>
                      <card.icon className={`h-4 w-4 text-${card.color}-light`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{card.value}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs">
                        {card.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-green-light" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-light" />
                        )}
                        <span className={`font-medium ${
                          card.change >= 0 ? 'text-green-light' : 'text-red-light'
                        }`}>
                          {card.change >= 0 ? '+' : ''}{card.change}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Show error state for stats
              <div className="col-span-full">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Unable to load dashboard statistics.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Recent Activity Card */}
            <div className="lg:col-span-8">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-light" />
                      Recent Activity
                      {realtime.isConnected && (
                        <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Your latest business activities and updates
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {activity.loading ? (
                    // Show skeleton loading state
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <ActivityItemSkeleton key={index} />
                      ))}
                    </div>
                  ) : activity.data && activity.data.length > 0 ? (
                    // Show actual activity items
                    <div className="space-y-4">
                      {activity.data.map((activityItem, index) => {
                        const ActivityIcon = getActivityIcon(activityItem.type)
                        const color = getActivityColor(activityItem.type)
                        
                        return (
                          <div key={activityItem.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={`p-2 rounded-lg bg-${color}-light/10`}>
                              <ActivityIcon className={`w-4 h-4 text-${color}-light`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">{activityItem.title}</p>
                              <p className="text-xs text-muted-foreground">{activityItem.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(activityItem.timestamp)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : activity.error ? (
                    // Show error state
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to load recent activity.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    // Show empty state
                    <EmptyActivity showCard={false} />
                  )}
                  
                  {activity.hasMore && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={activity.loadMore}
                        disabled={activity.loading}
                      >
                        {activity.loading ? 'Loading...' : 'Load More Activity'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:shadow-md transition-all"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className={`p-2 rounded-lg bg-${action.color}-light/10 mr-3`}>
                        <action.icon className={`w-4 h-4 text-${action.color}-light`} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Deadlines Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-red-light" />
                      Upcoming Deadlines
                      {realtime.isConnected && (
                        <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    {deadlines.overdueTasks > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {deadlines.overdueTasks} overdue
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Projects and tasks due soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deadlines.loading ? (
                    // Show skeleton loading state
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <DeadlineItemSkeleton key={index} />
                      ))}
                    </div>
                  ) : deadlines.data && deadlines.data.length > 0 ? (
                    // Show actual deadline items
                    <div className="space-y-4">
                      {deadlines.data.map((deadline, index) => {
                        const daysLeft = getDaysUntilDeadline(deadline.dueDate)
                        const isOverdue = daysLeft < 0
                        const isUrgent = daysLeft <= 3 && daysLeft >= 0
                        
                        return (
                          <div key={deadline.id} className="space-y-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{deadline.projectName}</p>
                                <p className="text-xs text-muted-foreground">{deadline.clientName}</p>
                                <p className="text-xs">{deadline.taskName}</p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={
                                    isOverdue ? 'destructive' :
                                    isUrgent ? 'destructive' :
                                    deadline.priority === 'high' ? 'destructive' :
                                    deadline.priority === 'medium' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{deadline.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all ${
                                    isOverdue ? 'bg-red-light' :
                                    deadline.priority === 'high' ? 'bg-red-light' :
                                    deadline.priority === 'medium' ? 'bg-yellow' : 'bg-green-light'
                                  }`}
                                  style={{ width: `${deadline.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : deadlines.error ? (
                    // Show error state
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to load upcoming deadlines.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    // Show empty state
                    <EmptyDeadlines 
                      showCard={false} 
                      onCreateProject={handleCreateProject}
                    />
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      View All Deadlines
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}