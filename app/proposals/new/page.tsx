'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  BarChart3,
  Settings,
  Menu,
  Bell,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  LogOut,
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Code,
  Database,
  Smartphone,
  Monitor,
  Zap,
  Shield,
  CreditCard,
  FileCheck,
  Save,
  Send
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Proposals', href: '/proposals', active: true, badge: '3' },
  { icon: FolderOpen, label: 'Projects', href: '/projects', badge: '8' },
  { icon: Users, label: 'Client Portals', href: '/clients' },
  { icon: Clock, label: 'Time Tracking', href: '/time-tracking' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

// Form steps configuration
const steps = [
  {
    id: 1,
    title: 'Client Information',
    description: 'Basic client details and contact information',
    icon: Users,
    fields: ['clientName', 'clientEmail', 'company', 'industry']
  },
  {
    id: 2,
    title: 'Project Details',
    description: 'Project overview and requirements',
    icon: FileText,
    fields: ['projectTitle', 'projectType', 'description', 'requirements']
  },
  {
    id: 3,
    title: 'Technical Specifications',
    description: 'Technology stack and integrations',
    icon: Code,
    fields: ['techStack', 'integrations', 'timeline']
  },
  {
    id: 4,
    title: 'Budget & Terms',
    description: 'Pricing and payment terms',
    icon: DollarSign,
    fields: ['budgetRange', 'paymentTerms', 'projectTimeline']
  }
]

// Form data interface
interface ProposalFormData {
  // Step 1: Client Information
  clientName: string
  clientEmail: string
  company: string
  industry: string
  
  // Step 2: Project Details
  projectTitle: string
  projectType: string
  description: string
  requirements: string
  
  // Step 3: Technical Specifications
  techStack: string[]
  integrations: string[]
  timeline: string
  
  // Step 4: Budget & Terms
  budgetRange: string
  paymentTerms: string
  projectTimeline: string
}

// Industry options
const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Consulting',
  'Marketing',
  'Non-profit',
  'Other'
]

// Project type options
const projectTypes = [
  'Website Development',
  'Mobile App Development',
  'E-commerce Platform',
  'Web Application',
  'API Development',
  'Database Design',
  'UI/UX Design',
  'Brand Identity',
  'Digital Marketing',
  'Consulting',
  'Other'
]

// Technology stack options
const techStackOptions = [
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'PHP',
  'Laravel',
  'WordPress',
  'Shopify',
  'TypeScript',
  'JavaScript',
  'HTML/CSS',
  'Tailwind CSS',
  'Bootstrap'
]

// Integration options
const integrationOptions = [
  'Payment Processing (Stripe, PayPal)',
  'Email Marketing (Mailchimp, SendGrid)',
  'CRM (Salesforce, HubSpot)',
  'Analytics (Google Analytics)',
  'Social Media APIs',
  'Third-party APIs',
  'Database Integration',
  'Cloud Services (AWS, Azure)',
  'Authentication Systems',
  'E-commerce Platforms'
]

// Budget range options
const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000',
  'Hourly Rate',
  'To be discussed'
]

// Payment terms options
const paymentTermsOptions = [
  '50% upfront, 50% on completion',
  '25% upfront, 75% on completion',
  '33% upfront, 33% milestone, 34% completion',
  'Monthly payments',
  'Milestone-based payments',
  'Net 30',
  'Net 15',
  'Payment on delivery'
]

export default function NewProposalPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProposalFormData>({
    // Step 1
    clientName: '',
    clientEmail: '',
    company: '',
    industry: '',
    
    // Step 2
    projectTitle: '',
    projectType: '',
    description: '',
    requirements: '',
    
    // Step 3
    techStack: [],
    integrations: [],
    timeline: '',
    
    // Step 4
    budgetRange: '',
    paymentTerms: '',
    projectTimeline: ''
  })

  const handleSignOut = async () => {
    await signOut()
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayUpdate = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof ProposalFormData] as string[]), value]
        : (prev[field as keyof ProposalFormData] as string[]).filter(item => item !== value)
    }))
  }

  const validateStep = (stepNumber: number): boolean => {
    const step = steps.find(s => s.id === stepNumber)
    if (!step) return false

    return step.fields.every(field => {
      const value = formData[field as keyof ProposalFormData]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value && value.toString().trim() !== ''
    })
  }

  const canProceedToNext = () => {
    return validateStep(currentStep)
  }

  const handleNext = () => {
    if (currentStep < steps.length && canProceedToNext()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Submitting proposal:', formData)
    // TODO: Implement actual submission logic
    router.push('/proposals')
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'upcoming'
  }

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Client Information</h2>
              <p className="text-muted-foreground">
                Let's start with basic information about your client and their business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  value={formData.clientName}
                  onChange={(e) => updateFormData('clientName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email Address *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.clientEmail}
                  onChange={(e) => updateFormData('clientEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Client Communication</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This information will be used to personalize your proposal and establish initial contact with the client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Details</h2>
              <p className="text-muted-foreground">
                Describe the project scope, objectives, and key requirements.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  placeholder="E-commerce Website Redesign"
                  value={formData.projectTitle}
                  onChange={(e) => updateFormData('projectTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(value) => updateFormData('projectType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the project, including goals, target audience, and expected outcomes..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Key Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the main requirements, features, and functionalities needed for this project..."
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => updateFormData('requirements', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Project Clarity</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Clear project details help set proper expectations and reduce scope creep during development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Technical Specifications</h2>
              <p className="text-muted-foreground">
                Define the technology stack, integrations, and technical timeline.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Technology Stack *</Label>
                <p className="text-sm text-muted-foreground">Select the technologies you'll use for this project</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {techStackOptions.map((tech) => (
                    <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.techStack.includes(tech)}
                        onChange={(e) => handleArrayUpdate('techStack', tech, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Required Integrations *</Label>
                <p className="text-sm text-muted-foreground">Select any third-party integrations needed</p>
                <div className="space-y-2">
                  {integrationOptions.map((integration) => (
                    <label key={integration} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.integrations.includes(integration)}
                        onChange={(e) => handleArrayUpdate('integrations', integration, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{integration}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Development Timeline *</Label>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <Code className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Technical Planning</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Detailed technical specifications help clients understand the complexity and value of your work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Budget & Terms</h2>
              <p className="text-muted-foreground">
                Set your pricing structure and define payment terms for the project.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget Range *</Label>
                <Select value={formData.budgetRange} onValueChange={(value) => updateFormData('budgetRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms *</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData('paymentTerms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map((terms) => (
                      <SelectItem key={terms} value={terms}>
                        {terms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTimeline">Project Timeline *</Label>
                <Select value={formData.projectTimeline} onValueChange={(value) => updateFormData('projectTimeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">As soon as possible</SelectItem>
                    <SelectItem value="1 month">Within 1 month</SelectItem>
                    <SelectItem value="2 months">Within 2 months</SelectItem>
                    <SelectItem value="3 months">Within 3 months</SelectItem>
                    <SelectItem value="6 months">Within 6 months</SelectItem>
                    <SelectItem value="flexible">Timeline is flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">Pricing Strategy</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Clear pricing and payment terms help build trust and prevent misunderstandings with clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Proposal Summary */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
              <h3 className="font-semibold mb-4">Proposal Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Client:</span> {formData.clientName} ({formData.company})
                </div>
                <div>
                  <span className="font-medium">Project:</span> {formData.projectTitle}
                </div>
                <div>
                  <span className="font-medium">Budget:</span> {formData.budgetRange}
                </div>
                <div>
                  <span className="font-medium">Timeline:</span> {formData.timeline}
                </div>
                <div>
                  <span className="font-medium">Tech Stack:</span> {formData.techStack.slice(0, 3).join(', ')}
                  {formData.techStack.length > 3 && ` +${formData.techStack.length - 3} more`}
                </div>
                <div>
                  <span className="font-medium">Payment:</span> {formData.paymentTerms}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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

          {/* Back to Proposals */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/proposals')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Proposals</span>
            </Button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Save Draft Button */}
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-light text-xs text-white flex items-center justify-center">
                2
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
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Create New Proposal</h1>
              <p className="text-muted-foreground mt-2">
                Follow the steps below to create a comprehensive proposal for your client
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-6" />
              
              {/* Step Indicators */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const StepIcon = step.icon
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                        ${status === 'completed' ? 'bg-green-light border-green-light text-white' :
                          status === 'current' ? 'bg-blue-light border-blue-light text-white' :
                          'bg-background border-muted-foreground/30 text-muted-foreground'}
                      `}>
                        {status === 'completed' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${
                          status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content */}
            <Card>
              <CardContent className="p-8">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {currentStep === steps.length ? (
                  <>
                    <Button variant="outline" onClick={handleSubmit}>
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button onClick={handleSubmit} disabled={!canProceedToNext()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Proposal
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Validation Message */}
            {!canProceedToNext() && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please fill in all required fields before proceeding to the next step.
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}