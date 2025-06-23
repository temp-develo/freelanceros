'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Settings, User, LogOut, Plus, Filter, Download, Upload, Edit, Trash2, MoreHorizontal, Bell, Mail, MessageSquare, Phone, MapPin, Clock, DollarSign, Users, FileText, BarChart3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

// Sample data for command palette
const commandItems = [
  {
    group: 'Projects',
    items: [
      { id: 'project-1', title: 'Website Redesign', subtitle: 'Acme Corp', icon: FileText },
      { id: 'project-2', title: 'Mobile App Development', subtitle: 'TechStart Inc', icon: FileText },
      { id: 'project-3', title: 'Brand Identity', subtitle: 'Creative Studio', icon: FileText },
      { id: 'project-4', title: 'E-commerce Platform', subtitle: 'Retail Plus', icon: FileText },
    ],
  },
  {
    group: 'Clients',
    items: [
      { id: 'client-1', title: 'Sarah Johnson', subtitle: 'Acme Corp', icon: User },
      { id: 'client-2', title: 'Michael Chen', subtitle: 'TechStart Inc', icon: User },
      { id: 'client-3', title: 'Emma Rodriguez', subtitle: 'Creative Studio', icon: User },
      { id: 'client-4', title: 'David Kim', subtitle: 'Retail Plus', icon: User },
    ],
  },
  {
    group: 'Actions',
    items: [
      { id: 'action-1', title: 'Create New Project', subtitle: 'Start a new project', icon: Plus },
      { id: 'action-2', title: 'Generate Invoice', subtitle: 'Create client invoice', icon: DollarSign },
      { id: 'action-3', title: 'Schedule Meeting', subtitle: 'Book a client meeting', icon: CalendarIcon },
      { id: 'action-4', title: 'View Analytics', subtitle: 'Check performance metrics', icon: BarChart3 },
    ],
  },
];

export default function AdvancedShowcasePage() {
  const [date, setDate] = useState<Date>();
  const [projectDeadline, setProjectDeadline] = useState<Date>();
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleCommandSelect = (item: any) => {
    toast.success(`Selected: ${item.title}`, {
      description: item.subtitle,
    });
    setCommandOpen(false);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      toast.success('Date selected', {
        description: `Selected: ${format(selectedDate, 'PPP')}`,
      });
    }
  };

  const handleDeadlineSelect = (selectedDate: Date | undefined) => {
    setProjectDeadline(selectedDate);
    if (selectedDate) {
      toast.success('Project deadline set', {
        description: `Deadline: ${format(selectedDate, 'PPP')}`,
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Advanced Components Showcase
          </h1>
          <p className="text-base-500 text-lg">
            Interactive advanced components including popovers, dropdowns, command palette, and date pickers
          </p>
        </div>

        <Separator />

        {/* Command Palette Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Command Palette</h2>
            <p className="text-muted-foreground">
              Quick search and navigation through projects, clients, and actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-light" />
                  Global Search
                </CardTitle>
                <CardDescription>Search across all your projects and clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setCommandOpen(true)}
                  variant="outline" 
                  className="w-full justify-start text-muted-foreground"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search projects, clients, actions...
                  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      <Plus className="w-3 h-3 mr-1" />
                      New Project
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Invoice
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      Meeting
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Features</CardTitle>
                <CardDescription>Powerful search capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-light" />
                      Project Search
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Find projects by name, client, or status
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-light" />
                      Client Directory
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Search through your client database
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-orange-light" />
                      Quick Actions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Execute common tasks instantly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {commandItems.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleCommandSelect(item)}
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </CommandDialog>
        </section>

        <Separator />

        {/* Popover Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Popover Components</h2>
            <p className="text-muted-foreground">
              Contextual overlays for forms, settings, and additional information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Settings Popover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-light" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Quick profile configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Profile Settings</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your profile information.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue="john@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input id="bio" placeholder="Tell us about yourself..." />
                        </div>
                        <Button className="w-full" onClick={() => toast.success('Profile updated!')}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Project Quick Add Popover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-light" />
                  Quick Add Project
                </CardTitle>
                <CardDescription>Create new project quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Create Project</h4>
                        <p className="text-sm text-muted-foreground">
                          Add a new project to your workspace.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name</Label>
                          <Input id="project-name" placeholder="Enter project name..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-name">Client</Label>
                          <Input id="client-name" placeholder="Client name..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget (USD)</Label>
                          <Input id="budget" type="number" placeholder="5000" />
                        </div>
                        <Button className="w-full" onClick={() => toast.success('Project created!')}>
                          Create Project
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Notification Settings Popover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-purple-light" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notification Settings</h4>
                        <p className="text-sm text-muted-foreground">
                          Configure how you receive notifications.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <input
                            type="checkbox"
                            id="push-notifications"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-updates">Email Updates</Label>
                          <input
                            type="checkbox"
                            id="email-updates"
                            checked={emailUpdates}
                            onChange={(e) => setEmailUpdates(e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        <Separator />
                        <Button 
                          className="w-full" 
                          onClick={() => toast.success('Notification settings saved!')}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Dropdown Menu Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Dropdown Menu Components</h2>
            <p className="text-muted-foreground">
              Context menus with actions, filters, and navigation options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Account Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-light" />
                  User Account Menu
                </CardTitle>
                <CardDescription>Account actions and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      John Doe
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.info('Opening profile...')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Opening settings...')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Opening messages...')}>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => toast.success('Logged out successfully')}
                      className="text-red-light focus:text-red-light"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Project Actions Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MoreHorizontal className="w-5 h-5 mr-2 text-green-light" />
                  Project Actions
                </CardTitle>
                <CardDescription>Project management actions</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Website Redesign
                      <MoreHorizontal className="w-4 h-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.info('Opening project...')}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Duplicating project...')}>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => toast.success('Exporting as PDF...')}>
                          PDF Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Exporting as CSV...')}>
                          CSV Data
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Exporting as JSON...')}>
                          JSON Export
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => toast.error('Project archived')}
                      className="text-red-light focus:text-red-light"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Archive Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Filter Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-purple-light" />
                  Filter Options
                </CardTitle>
                <CardDescription>Filter and sort controls</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Projects
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
                      <DropdownMenuRadioItem value="all">All Projects</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="on-hold">On Hold</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Priority Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selectedPriority} onValueChange={setSelectedPriority}>
                      <DropdownMenuRadioItem value="high">High Priority</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">Medium Priority</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="low">Low Priority</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="ml-2 capitalize">{selectedStatus}</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="secondary" className="ml-2 capitalize">{selectedPriority}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Calendar Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Calendar & Date Picker</h2>
            <p className="text-muted-foreground">
              Date selection components for scheduling and deadline management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-light" />
                  Calendar Widget
                </CardTitle>
                <CardDescription>Interactive calendar for date selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                  />
                  {date && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Selected Date:</p>
                      <p className="text-sm text-muted-foreground">
                        {format(date, 'EEEE, MMMM do, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date Picker for Project Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-light" />
                  Project Deadline Picker
                </CardTitle>
                <CardDescription>Set project deadlines and milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {projectDeadline ? format(projectDeadline, 'PPP') : 'Pick a deadline'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={projectDeadline}
                        onSelect={handleDeadlineSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {projectDeadline && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Deadline Set:</p>
                      <p className="text-sm text-muted-foreground">
                        {format(projectDeadline, 'EEEE, MMMM do, yyyy')}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Quick Deadline Options</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextWeek = new Date();
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            handleDeadlineSelect(nextWeek);
                          }}
                        >
                          Next Week
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextMonth = new Date();
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            handleDeadlineSelect(nextMonth);
                          }}
                        >
                          Next Month
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextQuarter = new Date();
                            nextQuarter.setMonth(nextQuarter.getMonth() + 3);
                            handleDeadlineSelect(nextQuarter);
                          }}
                        >
                          Next Quarter
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Project Deadlines</CardTitle>
              <CardDescription>Track important dates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { project: 'Website Redesign', client: 'Acme Corp', deadline: '2024-02-15', priority: 'high' },
                  { project: 'Mobile App Development', client: 'TechStart Inc', deadline: '2024-02-28', priority: 'medium' },
                  { project: 'Brand Identity', client: 'Creative Studio', deadline: '2024-03-10', priority: 'low' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{item.project}</p>
                      <p className="text-sm text-muted-foreground">{item.client}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        {format(new Date(item.deadline), 'MMM dd, yyyy')}
                      </p>
                      <Badge 
                        variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-base-950/50 to-base-900/50 border-base-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Advanced Components Summary
              </CardTitle>
              <CardDescription className="text-base">
                Sophisticated interaction patterns for modern applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-light">Popover</div>
                  <div className="text-sm text-muted-foreground">Contextual overlays</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-light">Dropdown</div>
                  <div className="text-sm text-muted-foreground">Action menus</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-light">Command</div>
                  <div className="text-sm text-muted-foreground">Search palette</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-light">Calendar</div>
                  <div className="text-sm text-muted-foreground">Date selection</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}