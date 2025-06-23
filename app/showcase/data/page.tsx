'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BarChart3,
  XCircle,
  TrendingUp,
  Building,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

// Sample data
const clientsData = [
  {
    id: 1,
    name: 'Acme Corporation',
    contact: 'Sarah Johnson',
    email: 'sarah@acme.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    projects: 3,
    totalValue: 45000,
    status: 'Active',
    lastContact: '2024-01-15',
  },
  {
    id: 2,
    name: 'TechStart Inc.',
    contact: 'Michael Chen',
    email: 'michael@techstart.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    projects: 2,
    totalValue: 32000,
    status: 'Active',
    lastContact: '2024-01-12',
  },
  {
    id: 3,
    name: 'Design Studio Pro',
    contact: 'Emma Rodriguez',
    email: 'emma@designstudio.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    projects: 1,
    totalValue: 18000,
    status: 'Completed',
    lastContact: '2024-01-08',
  },
  {
    id: 4,
    name: 'Global Solutions Ltd',
    contact: 'David Kim',
    email: 'david@globalsolutions.com',
    phone: '+1 (555) 321-0987',
    location: 'Chicago, IL',
    projects: 4,
    totalValue: 67000,
    status: 'Active',
    lastContact: '2024-01-14',
  },
  {
    id: 5,
    name: 'Innovation Labs',
    contact: 'Lisa Wang',
    email: 'lisa@innovationlabs.com',
    phone: '+1 (555) 654-3210',
    location: 'Seattle, WA',
    projects: 2,
    totalValue: 28000,
    status: 'Pending',
    lastContact: '2024-01-10',
  },
];

const projectsData = [
  {
    id: 1,
    name: 'E-commerce Platform Redesign',
    client: 'Acme Corporation',
    status: 'In Progress',
    progress: 75,
    budget: 25000,
    deadline: '2024-02-15',
    team: ['John Doe', 'Jane Smith'],
  },
  {
    id: 2,
    name: 'Mobile App Development',
    client: 'TechStart Inc.',
    status: 'Planning',
    progress: 25,
    budget: 40000,
    deadline: '2024-03-30',
    team: ['Alex Johnson', 'Maria Garcia'],
  },
  {
    id: 3,
    name: 'Brand Identity Package',
    client: 'Design Studio Pro',
    status: 'Completed',
    progress: 100,
    budget: 15000,
    deadline: '2024-01-20',
    team: ['Sarah Lee'],
  },
  {
    id: 4,
    name: 'Website Optimization',
    client: 'Global Solutions Ltd',
    status: 'In Progress',
    progress: 60,
    budget: 12000,
    deadline: '2024-02-28',
    team: ['Mike Wilson', 'Anna Brown'],
  },
];

const proposalsData = [
  {
    id: 1,
    title: 'Custom CRM Development',
    client: 'Enterprise Corp',
    value: 85000,
    status: 'Pending',
    submittedDate: '2024-01-10',
    responseDate: '2024-01-25',
  },
  {
    id: 2,
    title: 'Marketing Website Redesign',
    client: 'StartupXYZ',
    value: 22000,
    status: 'Accepted',
    submittedDate: '2024-01-05',
    responseDate: '2024-01-12',
  },
  {
    id: 3,
    title: 'Mobile App UI/UX Design',
    client: 'FinTech Solutions',
    value: 35000,
    status: 'Rejected',
    submittedDate: '2024-01-08',
    responseDate: '2024-01-15',
  },
];

const faqData = [
  {
    id: 'pricing',
    question: 'How do you determine project pricing?',
    answer: 'Project pricing is based on several factors including project complexity, timeline, required expertise, and deliverables. I provide detailed estimates after understanding your specific requirements and goals. Most projects are quoted as fixed-price packages, though hourly rates are available for ongoing maintenance or consultation work.',
  },
  {
    id: 'timeline',
    question: 'What is the typical project timeline?',
    answer: 'Project timelines vary depending on scope and complexity. Simple websites typically take 2-4 weeks, while complex web applications can take 8-16 weeks. I provide detailed project schedules with milestones and regular progress updates. Rush projects may be accommodated with adjusted pricing.',
  },
  {
    id: 'process',
    question: 'What is your development process?',
    answer: 'My development process follows industry best practices: Discovery & Planning, Design & Prototyping, Development & Testing, Review & Refinement, and Launch & Support. Each phase includes client collaboration and approval before moving forward. I use modern tools and maintain clear communication throughout.',
  },
  {
    id: 'revisions',
    question: 'How many revisions are included?',
    answer: 'Most projects include 2-3 rounds of revisions at each major milestone. Additional revisions beyond the agreed scope may incur extra charges. I encourage detailed feedback during the review phases to ensure the final product meets your expectations.',
  },
  {
    id: 'support',
    question: 'Do you provide ongoing support?',
    answer: 'Yes, I offer various support packages including bug fixes, content updates, security maintenance, and feature enhancements. Support can be provided on a retainer basis or as needed. I also provide training to help you manage your website or application independently.',
  },
  {
    id: 'technologies',
    question: 'What technologies do you work with?',
    answer: 'I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various databases. For design, I use Figma and Adobe Creative Suite. I stay current with industry trends and can recommend the best technology stack for your specific needs.',
  },
];

export default function DataShowcasePage() {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
      case 'accepted':
        return <Badge className="bg-green-light/20 text-green-light border-green-light/30">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-orange-light/20 text-orange-light border-orange-light/30">{status}</Badge>;
      case 'completed':
        return <Badge className="bg-blue-light/20 text-blue-light border-blue-light/30">{status}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Data Display Components Showcase
          </h1>
          <p className="text-base-500 text-lg">
            Tables, accordions, tabs, and skeleton loading states for comprehensive data presentation
          </p>
        </div>

        <Separator />

        {/* Table Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Data Tables</h2>
            <p className="text-muted-foreground">
              Sortable tables for displaying structured data with interactive headers
            </p>
          </div>

          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clients">
                <Users className="w-4 h-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="projects">
                <FileText className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="proposals">
                <DollarSign className="w-4 h-4 mr-2" />
                Proposals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-light" />
                    Client Management
                  </CardTitle>
                  <CardDescription>
                    Overview of all clients with contact information and project status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of your recent clients and their project status.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('name')}
                            className="h-auto p-0 font-medium"
                          >
                            Client Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-center">Projects</TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('totalValue')}
                            className="h-auto p-0 font-medium"
                          >
                            Total Value
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Last Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientsData.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{client.contact}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {client.email}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {client.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                              {client.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{client.projects}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${client.totalValue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(client.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(client.lastContact).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-light" />
                    Project Portfolio
                  </CardTitle>
                  <CardDescription>
                    Current and completed projects with progress tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Your project portfolio with current status and progress.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Progress</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Team</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectsData.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.client}</TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(project.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{project.progress}%</div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${project.budget.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                              {new Date(project.deadline).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <Avatar key={index} className="w-8 h-8 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    {member.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <Avatar className="w-8 h-8 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    +{project.team.length - 3}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-light" />
                    Proposal Tracking
                  </CardTitle>
                  <CardDescription>
                    Track submitted proposals and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Recent proposals and their response status.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposal Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Response Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposalsData.map((proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell className="font-medium">{proposal.title}</TableCell>
                          <TableCell>{proposal.client}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${proposal.value.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(proposal.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(proposal.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(proposal.responseDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* Accordion Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Accordion Components</h2>
            <p className="text-muted-foreground">
              Collapsible content sections perfect for FAQs and detailed information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-blue-light" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about services and processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-light" />
                  Business Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators and business insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="revenue">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-light" />
                        Revenue Analytics
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-light">$164K</div>
                            <div className="text-sm text-muted-foreground">This Year</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-light">$28K</div>
                            <div className="text-sm text-muted-foreground">This Month</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Revenue has increased by 23% compared to last year, with consistent growth across all service categories.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="clients">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-light" />
                        Client Metrics
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-blue-light">24</div>
                            <div className="text-xs text-muted-foreground">Active Clients</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-green-light">96%</div>
                            <div className="text-xs text-muted-foreground">Satisfaction</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-purple-light">18</div>
                            <div className="text-xs text-muted-foreground">Referrals</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Client retention rate is at an all-time high with strong referral growth indicating excellent service quality.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="projects">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-purple-light" />
                        Project Statistics
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completed</span>
                              <span className="font-medium">42</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>In Progress</span>
                              <span className="font-medium">8</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Planning</span>
                              <span className="font-medium">3</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>On Time</span>
                              <span className="font-medium text-green-light">94%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Under Budget</span>
                              <span className="font-medium text-blue-light">87%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Avg. Duration</span>
                              <span className="font-medium">6.2 weeks</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Tabs Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Tabbed Interface</h2>
            <p className="text-muted-foreground">
              Organize related content into accessible tabbed sections
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>
                Comprehensive view of your freelance business metrics and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <Clock className="w-4 h-4 mr-2" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="reports">
                    <FileText className="w-4 h-4 mr-2" />
                    Reports
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-8 h-8 text-green-light" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">$164,230</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-8 h-8 text-blue-light" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                            <p className="text-2xl font-bold">24</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-8 h-8 text-purple-light" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Projects</p>
                            <p className="text-2xl font-bold">53</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-8 h-8 text-orange-light" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Hours Logged</p>
                            <p className="text-2xl font-bold">1,247</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Projects</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {projectsData.slice(0, 3).map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium">{project.name}</p>
                              <p className="text-sm text-muted-foreground">{project.client}</p>
                            </div>
                            <div className="text-right space-y-1">
                              {getStatusBadge(project.status)}
                              <p className="text-sm text-muted-foreground">{project.progress}%</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Top Clients</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {clientsData.slice(0, 3).map((client) => (
                          <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.projects} projects</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${client.totalValue.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue over the past year</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">January</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div className="bg-green-light h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm font-medium">$18.5K</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">February</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div className="bg-green-light h-2 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                              <span className="text-sm font-medium">$14.8K</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">March</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div className="bg-green-light h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                              <span className="text-sm font-medium">$22.3K</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Types</CardTitle>
                        <CardDescription>Distribution of project categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Web Development</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">45%</Badge>
                              <span className="text-sm text-muted-foreground">24 projects</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">UI/UX Design</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">30%</Badge>
                              <span className="text-sm text-muted-foreground">16 projects</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consulting</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">25%</Badge>
                              <span className="text-sm text-muted-foreground">13 projects</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                      <CardDescription>Latest updates and actions across your projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-light mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Project milestone completed</p>
                            <p className="text-sm text-muted-foreground">E-commerce Platform Redesign - Phase 2 delivered</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Mail className="w-5 h-5 text-blue-light mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">New client inquiry</p>
                            <p className="text-sm text-muted-foreground">StartupXYZ interested in mobile app development</p>
                            <p className="text-xs text-muted-foreground">5 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-light mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Deadline reminder</p>
                            <p className="text-sm text-muted-foreground">Brand Identity Package due in 3 days</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-light mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Payment received</p>
                            <p className="text-sm text-muted-foreground">$12,500 from Global Solutions Ltd</p>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Monthly Report</CardTitle>
                        <CardDescription>January 2024 Performance Summary</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-green-light">$28,450</div>
                            <div className="text-sm text-muted-foreground">Revenue</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-blue-light">187h</div>
                            <div className="text-sm text-muted-foreground">Hours</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Projects Completed</span>
                            <span className="font-medium">7</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>New Clients</span>
                            <span className="font-medium">3</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Client Satisfaction</span>
                            <span className="font-medium text-green-light">98%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Export Options</CardTitle>
                        <CardDescription>Download detailed reports and data</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export Client List (CSV)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export Project Report (PDF)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Export Financial Summary (Excel)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Clock className="w-4 h-4 mr-2" />
                          Export Time Tracking (CSV)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Skeleton Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Skeleton Loading States</h2>
            <p className="text-muted-foreground">
              Loading placeholders that maintain layout structure while content loads
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Loading States Demo
                  <Button onClick={simulateLoading} disabled={isLoading} size="sm">
                    {isLoading ? 'Loading...' : 'Simulate Loading'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Click the button to see skeleton loading states in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <>
                    {/* Card Skeleton */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>

                    {/* List Skeleton */}
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Actual Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Project Update</h3>
                      <p className="text-muted-foreground">Latest progress on your active projects</p>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Sarah Chen</p>
                          <p className="text-sm text-muted-foreground">Project Manager</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'E-commerce Platform', status: 'In Progress', progress: 75 },
                        { name: 'Mobile App Design', status: 'Review', progress: 90 },
                        { name: 'Brand Guidelines', status: 'Planning', progress: 25 },
                        { name: 'Website Optimization', status: 'Testing', progress: 85 },
                      ].map((project, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {project.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.status}</p>
                          </div>
                          <Badge variant="outline">{project.progress}%</Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeleton Patterns</CardTitle>
                <CardDescription>
                  Different skeleton loading patterns for various content types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Skeleton */}
                <div className="space-y-2">
                  <h4 className="font-medium">Text Content</h4>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>

                {/* Card Skeleton */}
                <div className="space-y-2">
                  <h4 className="font-medium">Card Layout</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>

                {/* Table Skeleton */}
                <div className="space-y-2">
                  <h4 className="font-medium">Table Rows</h4>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-2 border rounded">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-base-950/50 to-base-900/50 border-base-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Data Display Components Summary
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive data presentation tools for modern applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-light">Table</div>
                  <div className="text-sm text-muted-foreground">Structured data display</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-light">Accordion</div>
                  <div className="text-sm text-muted-foreground">Collapsible content</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-light">Tabs</div>
                  <div className="text-sm text-muted-foreground">Organized sections</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-light">Skeleton</div>
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