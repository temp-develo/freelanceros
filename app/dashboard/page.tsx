'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  StatCardSkeleton,
  ActivityItemSkeleton,
  DeadlineItemSkeleton,
  QuickActionSkeleton,
  CardSkeleton
} from '@/components/ui/dashboard-skeletons'
import {
  Home,
  FileText,
  FolderOpen,
  Users,
  Clock,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Mail,
  Phone,
  Activity,
  Timer,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ExternalLink,
  Send,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: FileText, label: 'Proposals', href: '/proposals', badge: '3' },
  { icon: FolderOpen, label: 'Projects', href: '/projects', badge: '8' },
  { icon: Users, label: 'Client Portals', href: '/clients' },
  { icon: Clock, label: 'Time Tracking', href: '/time-tracking' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

// Enhanced stats cards with more detailed information
const statsCards = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+3',
    changePercent: '+25%',
    changeType: 'positive',
    icon: FolderOpen,
    description: 'Currently running',
    trend: 'up',
    color: 'blue'
  },
  {
    title: 'Pending Proposals',
    value: '5',
    change: '+2',
    changePercent: '+67%',
    changeType: 'positive',
    icon: FileText,
    description: 'Awaiting response',
    trend: 'up',
    color: 'purple'
  },
  {
    title: 'This Month Revenue',
    value: '$24,580',
    change: '+$3,240',
    changePercent: '+15.2%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'vs last month',
    trend: 'up',
    color: 'green'
  },
  {
    title: 'Hours Tracked',
    value: '156h',
    change: '+12h',
    changePercent: '+8.3%',
    changeType: 'positive',
    icon: Clock,
    description: 'This month',
    trend: 'up',
    color: 'orange'
  }
]

// Recent activity data
const recentActivities = [
  {
    type: 'proposal_sent',
    title: 'Proposal sent to Acme Corp',
    description: 'Website redesign proposal - $15,000',
    time: '2 hours ago',
    icon: Send,
    color: 'blue'
  },
  {
    type: 'project_completed',
    title: 'Project milestone completed',
    description: 'Mobile app wireframes for TechStart',
    time: '5 hours ago',
    icon: CheckCircle,
    color: 'green'
  },
  {
    type: 'payment_received',
    title: 'Payment received',
    description: '$5,000 from Creative Studio',
    time: '1 day ago',
    icon: DollarSign,
    color: 'green'
  },
  {
    type: 'meeting_scheduled',
    title: 'Meeting scheduled',
    description: 'Client review with Retail Plus',
    time: '2 days ago',
    icon: Calendar,
    color: 'purple'
  },
  {
    type: 'invoice_sent',
    title: 'Invoice sent',
    description: 'Monthly retainer - $3,500',
    time: '3 days ago',
    icon: FileText,
    color: 'orange'
  }
]

// Upcoming deadlines
const upcomingDeadlines = [
  {
    project: 'Website Redesign',
    client: 'Acme Corp',
    task: 'Final design review',
    dueDate: '2024-02-15',
    daysLeft: 3,
    priority: 'high',
    progress: 85
  },
  {
    project: 'Mobile App',
    client: 'TechStart Inc',
    task: 'Development phase 2',
    dueDate: '2024-02-20',
    daysLeft: 8,
    priority: 'medium',
    progress: 60
  },
  {
    project: 'Brand Identity',
    client: 'Creative Studio',
    task: 'Logo concepts',
    dueDate: '2024-02-25',
    daysLeft: 13,
    priority: 'low',
    progress: 30
  },
  {
    project: 'E-commerce Platform',
    client: 'Retail Plus',
    task: 'User testing',
    dueDate: '2024-03-01',
    daysLeft: 18,
    priority: 'medium',
    progress: 45
  }
]

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
    icon: Timer,
    color: 'purple',
    action: 'start_timer'
  }
]

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Loading states for different sections
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingActivity, setIsLoadingActivity] = useState(true)
  const [isLoadingQuickActions, setIsLoadingQuickActions] = useState(true)
  const [isLoadingDeadlines, setIsLoadingDeadlines] = useState(true)

  // Simulate data loading with different timing for each section
  useEffect(() => {
    // Stats cards load first (2 seconds)
    const statsTimer = setTimeout(() => {
      setIsLoadingStats(false)
    }, 2000)

    // Activity loads slightly later (2.5 seconds)
    const activityTimer = setTimeout(() => {
      setIsLoadingActivity(false)
    }, 2500)

    // Quick actions load next (3 seconds)
    const quickActionsTimer = setTimeout(() => {
      setIsLoadingQuickActions(false)
    }, 3000)

    // Deadlines load last (3.5 seconds)
    const deadlinesTimer = setTimeout(() => {
      setIsLoadingDeadlines(false)
    }, 3500)

    return () => {
      clearTimeout(statsTimer)
      clearTimeout(activityTimer)
      clearTimeout(quickActionsTimer)
      clearTimeout(deadlinesTimer)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`)
    // TODO: Implement actual actions
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg"></div>
        <span className="font-bold text-xl">FreelancerOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
            <AvatarFallback>
              {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-1 border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center max-w-md">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                className="flex h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search projects, clients, tasks..."
                type="search"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Quick Actions */}
            <Button size="sm" className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-light text-xs text-white flex items-center justify-center">
                3
              </span>
              <span className="sr-only">View notifications</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
                    <AvatarFallback>
                      {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here's what's happening with your freelance business.
              </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              {isLoadingStats ? (
                // Show skeleton loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <StatCardSkeleton key={index} />
                ))
              ) : (
                // Show actual stats cards
                statsCards.map((card) => (
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
                          {card.changeType === 'positive' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-light" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-light" />
                          )}
                          <span className={`font-medium ${
                            card.changeType === 'positive' ? 'text-green-light' : 'text-red-light'
                          }`}>
                            {card.changePercent}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{card.description}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {card.change} {card.description}
                      </div>
                    </CardContent>
                  </Card>
                ))
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
                    {isLoadingActivity ? (
                      // Show skeleton loading state
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <ActivityItemSkeleton key={index} />
                        ))}
                      </div>
                    ) : (
                      // Show actual activity items
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={`p-2 rounded-lg bg-${activity.color}-light/10`}>
                              <activity.icon className={`w-4 h-4 text-${activity.color}-light`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        View All Activity
                      </Button>
                    </div>
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
                    {isLoadingQuickActions ? (
                      // Show skeleton loading state
                      Array.from({ length: 4 }).map((_, index) => (
                        <QuickActionSkeleton key={index} />
                      ))
                    ) : (
                      // Show actual quick actions
                      quickActions.map((action, index) => (
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
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-red-light" />
                      Upcoming Deadlines
                    </CardTitle>
                    <CardDescription>
                      Projects and tasks due soon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDeadlines ? (
                      // Show skeleton loading state
                      <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <DeadlineItemSkeleton key={index} />
                        ))}
                      </div>
                    ) : (
                      // Show actual deadline items
                      <div className="space-y-4">
                        {upcomingDeadlines.map((deadline, index) => (
                          <div key={index} className="space-y-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{deadline.project}</p>
                                <p className="text-xs text-muted-foreground">{deadline.client}</p>
                                <p className="text-xs">{deadline.task}</p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={
                                    deadline.priority === 'high' ? 'destructive' :
                                    deadline.priority === 'medium' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {deadline.daysLeft}d left
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
                                    deadline.priority === 'high' ? 'bg-red-light' :
                                    deadline.priority === 'medium' ? 'bg-yellow' : 'bg-green-light'
                                  }`}
                                  style={{ width: `${deadline.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
        </main>
      </div>
    </div>
  )
}