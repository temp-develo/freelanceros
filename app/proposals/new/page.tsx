'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProposalForm } from '@/hooks/useProposalForm'
import { 
  saveProposalDraft, 
  loadProposalDraft, 
  clearProposalDraft,
  hasProposalDraft,
  getProposalDraftAge
} from '@/lib/storage/proposalDraft'
import { CompleteProposalData } from '@/lib/validations/proposal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FormFieldError, FormStepErrorSummary } from '@/components/ui/form-field-error'
import { AutoSaveIndicator, ConnectionStatus } from '@/components/ui/auto-save-indicator'
import { AIGenerateButton } from '@/components/ai/AIGenerateButton'
import { ProposalFormSkeleton } from '@/components/ui/proposal-skeletons'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
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
  Send,
  RefreshCw,
  Trash2,
  Info,
  FileText,
  Users
} from 'lucide-react'
import { toast } from 'sonner'

// Form steps configuration
const steps = [
  {
    id: 1,
    title: 'Client Information',
    description: 'Basic client details and contact information',
    icon: Users,
  },
  {
    id: 2,
    title: 'Project Details',
    description: 'Project overview and requirements',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Technical Specifications',
    description: 'Technology stack and integrations',
    icon: Code,
  },
  {
    id: 4,
    title: 'Budget & Terms',
    description: 'Pricing and payment terms',
    icon: DollarSign,
  }
]

// Form options
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
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [draftAge, setDraftAge] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form with auto-save and validation
  const {
    form,
    currentStep,
    setCurrentStep,
    totalSteps,
    canProceedToNext,
    canGoToPrevious,
    nextStep,
    previousStep,
    goToStep,
    isValid,
    isDirty,
    isSubmitting,
    stepErrors,
    validateCurrentStep,
    getStepValidation,
    isAutoSaving,
    lastAutoSaved,
    manualSave,
    submitForm,
    completionPercentage,
    completedSteps
  } = useProposalForm({
    autoSaveInterval: 30000, // 30 seconds
    onAutoSave: async (data) => {
      if (user?.id) {
        saveProposalDraft(data, user.id)
        toast.success('Draft saved automatically', { duration: 2000 })
      }
    },
    onSubmit: async (data) => {
      console.log('Submitting proposal:', data)
      // TODO: Implement actual API submission
      toast.success('Proposal submitted successfully!')
      clearProposalDraft()
      router.push('/proposals')
    },
    initialData: user?.id ? loadProposalDraft(user.id) || {} : {}
  })

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Check for existing draft on mount
  useEffect(() => {
    if (user?.id && hasProposalDraft(user.id)) {
      const age = getProposalDraftAge(user.id)
      setDraftAge(age)
      setShowDraftDialog(true)
    }
  }, [user?.id])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLoadDraft = () => {
    if (user?.id) {
      const draftData = loadProposalDraft(user.id)
      if (draftData) {
        form.reset(draftData as CompleteProposalData)
        toast.success('Draft loaded successfully')
      }
    }
    setShowDraftDialog(false)
  }

  const handleDiscardDraft = () => {
    clearProposalDraft()
    setShowDraftDialog(false)
    toast.info('Draft discarded')
  }

  const handleManualSave = async () => {
    try {
      await manualSave()
      toast.success('Draft saved successfully')
    } catch (error) {
      toast.error('Failed to save draft')
    }
  }

  const handleNext = async () => {
    const success = await nextStep()
    if (!success) {
      toast.error('Please fix validation errors before proceeding')
    }
  }

  const handleSubmit = async () => {
    try {
      await submitForm()
    } catch (error) {
      toast.error('Failed to submit proposal. Please try again.')
    }
  }

  const getStepStatus = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'upcoming'
  }

  // AI content generation handlers
  const handleGeneratedDescription = (content: string) => {
    form.setValue('description', content, { shouldDirty: true, shouldValidate: true })
    toast.success('Project description generated successfully!')
  }

  const handleGeneratedRequirements = (content: string) => {
    form.setValue('requirements', content, { shouldDirty: true, shouldValidate: true })
    toast.success('Project requirements generated successfully!')
  }

  const handleGeneratedTimeline = (content: string) => {
    // This would typically update a timeline field, but we're using it for context
    form.setValue('timeline', content, { shouldDirty: true, shouldValidate: true })
    toast.success('Development timeline generated successfully!')
  }

  const handleGeneratedBudget = (content: string) => {
    // This would typically update budget fields, but we're using it for context
    // For demo purposes, we'll just set the budgetRange field
    form.setValue('budgetRange', '$10,000 - $25,000', { shouldDirty: true, shouldValidate: true })
    form.setValue('paymentTerms', '50% upfront, 50% on completion', { shouldDirty: true, shouldValidate: true })
    toast.success('Budget information generated successfully!')
  }

  // Custom header actions for new proposal page
  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Auto-save Status */}
      <AutoSaveIndicator
        isAutoSaving={isAutoSaving}
        lastAutoSaved={lastAutoSaved}
        isDirty={isDirty}
      />

      {/* Connection Status */}
      <ConnectionStatus isOnline={isOnline} />

      {/* Save Draft Button */}
      <Button variant="outline" size="sm" onClick={handleManualSave} disabled={isAutoSaving}>
        <Save className="w-4 h-4 mr-2" />
        Save Draft
      </Button>
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

            <FormStepErrorSummary errors={stepErrors[1] || {}} />

            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

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

            <FormStepErrorSummary errors={stepErrors[2] || {}} />

            <Form {...form}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="E-commerce Website Redesign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Project Description *</FormLabel>
                        <AIGenerateButton
                          type="description"
                          context={{
                            projectTitle: form.getValues('projectTitle'),
                            projectType: form.getValues('projectType'),
                            industry: form.getValues('industry'),
                            clientName: form.getValues('clientName'),
                            company: form.getValues('company'),
                            existingContent: field.value
                          }}
                          onGenerated={handleGeneratedDescription}
                          disabled={!form.getValues('projectType') || !form.getValues('industry')}
                        />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of the project, including goals, target audience, and expected outcomes..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Key Requirements *</FormLabel>
                        <AIGenerateButton
                          type="requirements"
                          context={{
                            projectTitle: form.getValues('projectTitle'),
                            projectType: form.getValues('projectType'),
                            industry: form.getValues('industry'),
                            company: form.getValues('company'),
                            existingContent: field.value
                          }}
                          onGenerated={handleGeneratedRequirements}
                          disabled={!form.getValues('projectType') || !form.getValues('industry')}
                        />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="List the main requirements, features, and functionalities needed for this project..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

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

            <FormStepErrorSummary errors={stepErrors[3] || {}} />

            <Form {...form}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="techStack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Stack *</FormLabel>
                      <p className="text-sm text-muted-foreground">Select the technologies you'll use for this project</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {techStackOptions.map((tech) => (
                          <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.value?.includes(tech) || false}
                              onChange={(e) => {
                                const currentValue = field.value || []
                                if (e.target.checked) {
                                  field.onChange([...currentValue, tech])
                                } else {
                                  field.onChange(currentValue.filter(item => item !== tech))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{tech}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="integrations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Integrations *</FormLabel>
                      <p className="text-sm text-muted-foreground">Select any third-party integrations needed</p>
                      <div className="space-y-2">
                        {integrationOptions.map((integration) => (
                          <label key={integration} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.value?.includes(integration) || false}
                              onChange={(e) => {
                                const currentValue = field.value || []
                                if (e.target.checked) {
                                  field.onChange([...currentValue, integration])
                                } else {
                                  field.onChange(currentValue.filter(item => item !== integration))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{integration}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Development Timeline *</FormLabel>
                        <AIGenerateButton
                          type="timeline"
                          context={{
                            projectTitle: form.getValues('projectTitle'),
                            projectType: form.getValues('projectType'),
                            techStack: form.getValues('techStack'),
                            existingContent: field.value
                          }}
                          onGenerated={handleGeneratedTimeline}
                          disabled={!form.getValues('projectType') || !form.getValues('techStack')?.length}
                        />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                          <SelectItem value="1-2 months">1-2 months</SelectItem>
                          <SelectItem value="2-3 months">2-3 months</SelectItem>
                          <SelectItem value="3-6 months">3-6 months</SelectItem>
                          <SelectItem value="6+ months">6+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

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
        const formValues = form.getValues()
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Budget & Terms</h2>
              <p className="text-muted-foreground">
                Set your pricing structure and define payment terms for the project.
              </p>
            </div>

            <FormStepErrorSummary errors={stepErrors[4] || {}} />

            <Form {...form}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Budget Range *</FormLabel>
                        <AIGenerateButton
                          type="budget"
                          context={{
                            projectTitle: form.getValues('projectTitle'),
                            projectType: form.getValues('projectType'),
                            industry: form.getValues('industry'),
                            company: form.getValues('company'),
                            techStack: form.getValues('techStack'),
                            existingContent: field.value
                          }}
                          onGenerated={handleGeneratedBudget}
                          disabled={!form.getValues('projectType') || !form.getValues('techStack')?.length}
                        />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((terms) => (
                            <SelectItem key={terms} value={terms}>
                              {terms}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Timeline *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ASAP">As soon as possible</SelectItem>
                          <SelectItem value="1 month">Within 1 month</SelectItem>
                          <SelectItem value="2 months">Within 2 months</SelectItem>
                          <SelectItem value="3 months">Within 3 months</SelectItem>
                          <SelectItem value="6 months">Within 6 months</SelectItem>
                          <SelectItem value="flexible">Timeline is flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

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
                  <span className="font-medium">Client:</span> {formValues.clientName} ({formValues.company})
                </div>
                <div>
                  <span className="font-medium">Project:</span> {formValues.projectTitle}
                </div>
                <div>
                  <span className="font-medium">Budget:</span> {formValues.budgetRange}
                </div>
                <div>
                  <span className="font-medium">Timeline:</span> {formValues.timeline}
                </div>
                <div>
                  <span className="font-medium">Tech Stack:</span> {formValues.techStack?.slice(0, 3).join(', ')}
                  {(formValues.techStack?.length || 0) > 3 && ` +${(formValues.techStack?.length || 0) - 3} more`}
                </div>
                <div>
                  <span className="font-medium">Payment:</span> {formValues.paymentTerms}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/proposals')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Proposals</span>
          </Button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {headerActions}
          </div>
        </header>
        <div className="py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <ProposalFormSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Draft Recovery Dialog */}
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recover Draft Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              We found a saved draft from {draftAge !== null ? `${draftAge} minutes ago` : 'earlier'}. 
              Would you like to continue where you left off or start fresh?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardDraft}>
              <Trash2 className="w-4 h-4 mr-2" />
              Start Fresh
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadDraft}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Load Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/proposals')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Proposals</span>
        </Button>
        <div className="flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {headerActions}
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Proposal</h1>
                <p className="text-muted-foreground mt-2">
                  Follow the steps below to create a comprehensive proposal for your client
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}% complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-6" />
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id)
                const StepIcon = step.icon
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer
                      ${status === 'completed' ? 'bg-green-light border-green-light text-white' :
                        status === 'current' ? 'bg-blue-light border-blue-light text-white' :
                        'bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50'}
                    `}
                    onClick={() => goToStep(step.id)}
                    >
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

          {/* Offline Warning */}
          {!isOnline && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Your changes will be saved locally and synced when you reconnect.
              </AlertDescription>
            </Alert>
          )}

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
              onClick={previousStep}
              disabled={!canGoToPrevious}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === totalSteps ? (
                <>
                  <Button variant="outline" onClick={handleManualSave} disabled={isAutoSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={handleSubmit} disabled={!canProceedToNext || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Proposal
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Validation Message */}
          {!canProceedToNext && Object.keys(stepErrors[currentStep] || {}).length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please fix the validation errors above before proceeding to the next step.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}