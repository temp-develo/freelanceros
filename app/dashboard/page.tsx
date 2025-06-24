'use client'

import { useState } from 'react'
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
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Mail,
  Phone
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

const dashboardCards = [
  {
    title: 'Total Revenue',
    value: '$24,580',
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'This month'
  },
  {
    title: 'Active Projects',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: FolderOpen,
    description: 'Currently running'
  },
  {
    title: 'Hours Tracked',
    value: '156h',
    change: '+8.2%',
    changeType: 'positive',
    icon: Clock,
    description: 'This month'
  },
  {
    title: 'Pending Invoices',
    value: '$8,420',
    change: '-2.1%',
    changeType: 'negative',
    icon: AlertCircle,
    description: 'Awaiting payment'
  }
]

const recentProjects = [
  {
    name: 'Website Redesign',
    client: 'Acme Corp',
    status: 'In Progress',
    progress: 75,
    deadline: '2024-02-15'
  },
  {
    name: 'Mobile App Development',
    client: 'TechStart Inc',
    status: 'Review',
    progress: 90,
    deadline: '2024-02-28'
  },
  {
    name: 'Brand Identity',
    client: 'Creative Studio',
    status: 'Planning',
    progress: 25,
    deadline: '2024-03-10'
  }
]

const upcomingTasks = [
  { task: 'Client meeting with Acme Corp', time: '10:00 AM', priority: 'high' },
  { task: 'Submit project proposal', time: '2:00 PM', priority: 'medium' },
  { task: 'Review design mockups', time: '4:30 PM', priority: 'low' },
  { task: 'Update project timeline', time: '6:00 PM', priority: 'medium' }
]

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
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
            <div className="relative flex flex-1 items-center">
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
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your freelance business.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {dashboardCards.map((card) => (
                <Card key={card.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className={`flex items-center ${
                        card.changeType === 'positive' ? 'text-green-light' : 'text-red-light'
                      }`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.change}
                      </span>
                      <span>{card.description}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Your most recent project activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.client}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                project.status === 'In Progress' ? 'default' :
                                project.status === 'Review' ? 'secondary' : 'outline'
                              }>
                                {project.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Due: {project.deadline}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium">{project.progress}%</div>
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Tasks */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>
                      Your upcoming tasks and meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            task.priority === 'high' ? 'bg-red-light' :
                            task.priority === 'medium' ? 'bg-yellow' : 'bg-green-light'
                          }`} />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{task.task}</p>
                            <p className="text-xs text-muted-foreground">{task.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Full Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Proposal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Start Time Tracking
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Client
                    </Button>
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