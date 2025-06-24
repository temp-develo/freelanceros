'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  RefreshCw,
  Check,
  X,
  Copy,
  Edit,
  Wand2,
  Brain,
  FileText,
  Target,
  DollarSign,
  Clock,
  AlertCircle,
  Lightbulb,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

export interface AIGenerationRequest {
  type: 'description' | 'requirements' | 'timeline' | 'budget' | 'complete'
  context: {
    projectTitle?: string
    projectType?: string
    industry?: string
    clientName?: string
    company?: string
    techStack?: string[]
    existingContent?: string
  }
  tone?: 'professional' | 'friendly' | 'technical' | 'creative'
  length?: 'brief' | 'detailed' | 'comprehensive'
}

export interface AIGenerationResult {
  content: string
  suggestions?: string[]
  confidence: number
  reasoning?: string
}

interface AIGenerationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: AIGenerationRequest
  onAccept: (content: string) => void
  onRegenerate: (newRequest: AIGenerationRequest) => void
}

// Mock AI generation function - replace with actual OpenAI integration
const generateContent = async (request: AIGenerationRequest): Promise<AIGenerationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

  const { type, context, tone = 'professional', length = 'detailed' } = request

  // Mock responses based on request type
  const mockResponses = {
    description: {
      content: `We propose to develop a comprehensive ${context.projectType?.toLowerCase() || 'web application'} for ${context.company || 'your organization'} that will revolutionize how you engage with your customers and streamline your business operations.

Our solution will feature a modern, responsive design built with cutting-edge technologies including ${context.techStack?.slice(0, 3).join(', ') || 'React, Node.js, and PostgreSQL'}. The platform will be designed with scalability, security, and user experience as our top priorities.

Key features will include:
• Intuitive user interface optimized for all devices
• Robust backend architecture for reliable performance
• Advanced security measures to protect sensitive data
• Seamless integration with your existing systems
• Comprehensive analytics and reporting capabilities

This project will position ${context.company || 'your company'} as a leader in the ${context.industry?.toLowerCase() || 'technology'} industry while providing measurable improvements to operational efficiency and customer satisfaction.`,
      suggestions: [
        'Add specific ROI projections',
        'Include competitor analysis',
        'Mention compliance requirements',
        'Add user persona details'
      ],
      confidence: 0.87
    },
    requirements: {
      content: `Based on our analysis of your ${context.projectType?.toLowerCase() || 'project'} needs, we have identified the following key requirements:

**Functional Requirements:**
• User authentication and authorization system
• Responsive web design compatible with all modern browsers
• Real-time data synchronization and updates
• Advanced search and filtering capabilities
• Comprehensive admin dashboard with analytics
• Automated email notifications and alerts
• File upload and management system
• API integration with third-party services

**Technical Requirements:**
• ${context.techStack?.join(', ') || 'Modern technology stack'}
• Cloud-based hosting with 99.9% uptime guarantee
• SSL encryption and security best practices
• Database optimization for high performance
• Automated backup and disaster recovery
• Mobile-responsive design principles
• Cross-browser compatibility testing
• Performance optimization and caching

**Business Requirements:**
• Scalable architecture to support future growth
• Compliance with industry standards and regulations
• Integration with existing business processes
• Training and documentation for end users
• Ongoing maintenance and support options`,
      suggestions: [
        'Add performance benchmarks',
        'Include accessibility requirements',
        'Specify data retention policies',
        'Add integration requirements'
      ],
      confidence: 0.92
    },
    timeline: {
      content: `**Project Timeline - ${context.projectTitle || 'Development Project'}**

**Phase 1: Discovery & Planning (Weeks 1-2)**
• Stakeholder interviews and requirements gathering
• Technical architecture design and documentation
• UI/UX wireframes and design mockups
• Project scope finalization and approval

**Phase 2: Development Setup (Week 3)**
• Development environment configuration
• Database schema design and implementation
• Initial project structure and framework setup
• Version control and deployment pipeline setup

**Phase 3: Core Development (Weeks 4-8)**
• Backend API development and testing
• Frontend component development
• Database integration and optimization
• Core functionality implementation

**Phase 4: Integration & Testing (Weeks 9-10)**
• Third-party service integrations
• Comprehensive testing (unit, integration, E2E)
• Performance optimization and security audits
• Bug fixes and refinements

**Phase 5: Deployment & Launch (Weeks 11-12)**
• Production environment setup
• Data migration and system deployment
• User training and documentation delivery
• Go-live support and monitoring

**Total Project Duration: 12 weeks**
*Timeline includes buffer time for revisions and unexpected challenges*`,
      suggestions: [
        'Add milestone checkpoints',
        'Include client review periods',
        'Specify testing phases',
        'Add contingency planning'
      ],
      confidence: 0.89
    },
    budget: {
      content: `**Investment Breakdown for ${context.projectTitle || 'Your Project'}**

**Development Costs:**
• Frontend Development: $15,000 - $20,000
• Backend Development: $12,000 - $18,000
• Database Design & Setup: $3,000 - $5,000
• API Integration: $4,000 - $6,000
• Testing & QA: $3,000 - $5,000

**Design & UX:**
• UI/UX Design: $5,000 - $8,000
• Responsive Design Implementation: $3,000 - $5,000
• Brand Integration: $1,000 - $2,000

**Infrastructure & Deployment:**
• Cloud Hosting Setup: $1,000 - $2,000
• Security Implementation: $2,000 - $3,000
• Performance Optimization: $2,000 - $3,000

**Project Management & Documentation:**
• Project Management: $3,000 - $5,000
• Documentation & Training: $2,000 - $3,000
• Post-Launch Support (3 months): $3,000 - $5,000

**Total Investment Range: $54,000 - $89,000**

*Final pricing will be determined based on specific requirements and scope finalization. This investment includes all development, testing, deployment, and initial support.*`,
      suggestions: [
        'Add payment schedule options',
        'Include maintenance costs',
        'Specify what\'s included/excluded',
        'Add ROI projections'
      ],
      confidence: 0.85
    }
  }

  const response = mockResponses[type] || mockResponses.description

  return {
    ...response,
    reasoning: `Generated ${length} ${tone} content for ${type} based on ${context.projectType || 'general'} project in ${context.industry || 'technology'} industry.`
  }
}

export function AIGenerationModal({
  isOpen,
  onOpenChange,
  request,
  onAccept,
  onRegenerate
}: AIGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AIGenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  // Form state for regeneration
  const [tone, setTone] = useState<string>(request.tone || 'professional')
  const [length, setLength] = useState<string>(request.length || 'detailed')

  // Generate content when modal opens or request changes
  useEffect(() => {
    if (isOpen && !result) {
      handleGenerate()
    }
  }, [isOpen, request])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setResult(null)
      setError(null)
      setEditedContent('')
      setIsEditing(false)
      setGenerationProgress(0)
    }
  }, [isOpen])

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      setGenerationProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 300)

      const newRequest = {
        ...request,
        tone: tone as any,
        length: length as any
      }

      const generatedResult = await generateContent(newRequest)
      
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      setTimeout(() => {
        setResult(generatedResult)
        setEditedContent(generatedResult.content)
        setIsGenerating(false)
      }, 500)

    } catch (err) {
      setError('Failed to generate content. Please try again.')
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const handleRegenerate = () => {
    setResult(null)
    setEditedContent('')
    setIsEditing(false)
    handleGenerate()
  }

  const handleAccept = () => {
    const contentToAccept = isEditing ? editedContent : result?.content || ''
    onAccept(contentToAccept)
    onOpenChange(false)
    toast.success('AI-generated content applied successfully!')
  }

  const handleCopy = async () => {
    const contentToCopy = isEditing ? editedContent : result?.content || ''
    try {
      await navigator.clipboard.writeText(contentToCopy)
      toast.success('Content copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy content')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'description': return FileText
      case 'requirements': return Target
      case 'timeline': return Clock
      case 'budget': return DollarSign
      default: return Sparkles
    }
  }

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'description': return 'Project Description'
      case 'requirements': return 'Project Requirements'
      case 'timeline': return 'Project Timeline'
      case 'budget': return 'Budget Breakdown'
      default: return 'AI Generation'
    }
  }

  const TypeIcon = getTypeIcon(request.type)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-light to-blue-light flex items-center justify-center">
              <TypeIcon className="w-4 h-4 text-white" />
            </div>
            AI-Generated {getTypeTitle(request.type)}
          </DialogTitle>
          <DialogDescription>
            AI is generating content based on your project details. You can customize the tone and length, then edit the results before applying.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Generated Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Generation Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Generation Progress */}
                {isGenerating && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-light/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-light animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          AI is generating your content...
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Analyzing your project details and creating tailored content
                        </p>
                      </div>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Generated Content */}
                {result && !isGenerating && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Content Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <Check className="w-3 h-3 mr-1" />
                          Generated
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditing ? 'Preview' : 'Edit'}
                        </Button>
                      </div>
                    </div>

                    {/* Content Display/Edit */}
                    <div className="flex-1 overflow-hidden">
                      {isEditing ? (
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="h-full resize-none"
                          placeholder="Edit the generated content..."
                        />
                      ) : (
                        <div className="h-full overflow-y-auto p-4 bg-muted/30 rounded-lg border">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            {result.content.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-3 last:mb-0">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            AI Suggestions
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestions.map((suggestion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Content Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Content Length</Label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Context Information */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Project Context</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {request.context.projectTitle && (
                      <div>
                        <span className="font-medium">Project:</span> {request.context.projectTitle}
                      </div>
                    )}
                    {request.context.projectType && (
                      <div>
                        <span className="font-medium">Type:</span> {request.context.projectType}
                      </div>
                    )}
                    {request.context.industry && (
                      <div>
                        <span className="font-medium">Industry:</span> {request.context.industry}
                      </div>
                    )}
                    {request.context.company && (
                      <div>
                        <span className="font-medium">Client:</span> {request.context.company}
                      </div>
                    )}
                    {request.context.techStack && request.context.techStack.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Tech Stack:</span> {request.context.techStack.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Regenerate Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleRegenerate} 
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-light to-blue-light hover:from-purple-light/90 hover:to-blue-light/90"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Regenerate with New Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result && (
              <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={!result || isGenerating}
              className="bg-gradient-to-r from-green-light to-blue-light hover:from-green-light/90 hover:to-blue-light/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Content
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}