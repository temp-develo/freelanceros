'use client'

// OpenAI API integration for proposal generation
// This is a mock implementation - replace with actual OpenAI API calls

export interface OpenAIRequest {
  prompt: string
  maxTokens?: number
  temperature?: number
  model?: string
}

export interface OpenAIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Mock OpenAI client - replace with actual implementation
class MockOpenAIClient {
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  async generateCompletion(request: OpenAIRequest): Promise<OpenAIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))

    // Mock response based on prompt content
    const { prompt, maxTokens = 1000, temperature = 0.7 } = request

    // Analyze prompt to determine content type
    const promptLower = prompt.toLowerCase()
    let content = ''

    if (promptLower.includes('description') || promptLower.includes('overview')) {
      content = this.generateProjectDescription(prompt)
    } else if (promptLower.includes('requirements') || promptLower.includes('specifications')) {
      content = this.generateRequirements(prompt)
    } else if (promptLower.includes('timeline') || promptLower.includes('schedule')) {
      content = this.generateTimeline(prompt)
    } else if (promptLower.includes('budget') || promptLower.includes('cost') || promptLower.includes('pricing')) {
      content = this.generateBudget(prompt)
    } else {
      content = this.generateGenericContent(prompt)
    }

    return {
      content,
      usage: {
        promptTokens: Math.floor(prompt.length / 4),
        completionTokens: Math.floor(content.length / 4),
        totalTokens: Math.floor((prompt.length + content.length) / 4)
      }
    }
  }

  private generateProjectDescription(prompt: string): string {
    return `We propose to develop a comprehensive solution that will transform your business operations and deliver exceptional value to your organization.

Our approach combines cutting-edge technology with proven methodologies to create a robust, scalable platform tailored to your specific needs. The solution will feature an intuitive user interface, powerful backend architecture, and seamless integration capabilities.

Key benefits include:
• Enhanced operational efficiency
• Improved customer engagement
• Streamlined workflow management
• Comprehensive data analytics
• Scalable infrastructure for future growth

Our team brings extensive experience in similar projects across your industry, ensuring we understand the unique challenges and opportunities you face. We're committed to delivering a solution that not only meets your current requirements but positions your organization for long-term success.`
  }

  private generateRequirements(prompt: string): string {
    return `**Functional Requirements:**
• User authentication and role-based access control
• Responsive dashboard with real-time analytics
• Automated reporting and notification system
• Document management with version control
• Advanced search and filtering capabilities
• Multi-device compatibility and synchronization
• Customizable workflow automation
• Third-party integration framework

**Technical Requirements:**
• Secure API architecture with OAuth 2.0 implementation
• Database optimization for high-volume transactions
• Scalable cloud infrastructure with auto-scaling
• Comprehensive logging and monitoring
• Automated backup and disaster recovery
• Performance optimization for sub-second response times
• Cross-browser compatibility
• Accessibility compliance (WCAG 2.1 AA)

**Security Requirements:**
• End-to-end encryption for sensitive data
• Regular security audits and penetration testing
• Multi-factor authentication
• IP restriction and access controls
• Compliance with industry regulations
• Secure data storage and transmission`
  }

  private generateTimeline(prompt: string): string {
    return `**Phase 1: Discovery & Planning (Weeks 1-2)**
• Initial stakeholder interviews
• Requirements gathering and analysis
• Technical architecture planning
• Project scope finalization

**Phase 2: Design & Prototyping (Weeks 3-4)**
• UI/UX design concepts
• Interactive wireframes
• Design system development
• Prototype user testing

**Phase 3: Core Development (Weeks 5-8)**
• Database schema implementation
• API development
• Core functionality implementation
• Integration framework setup

**Phase 4: Feature Development (Weeks 9-12)**
• User management system
• Reporting and analytics
• Notification system
• Document management

**Phase 5: Testing & Optimization (Weeks 13-14)**
• Comprehensive testing (unit, integration, E2E)
• Performance optimization
• Security auditing
• Bug fixes and refinements

**Phase 6: Deployment & Training (Weeks 15-16)**
• Production environment setup
• Data migration
• User training and documentation
• Go-live support

**Total Project Duration: 16 weeks**`
  }

  private generateBudget(prompt: string): string {
    return `**Project Investment Breakdown**

**Development Costs:**
• Frontend Development: $18,000 - $25,000
• Backend Development: $20,000 - $28,000
• Database Design & Implementation: $8,000 - $12,000
• API Development & Integration: $10,000 - $15,000

**Design & UX:**
• UI/UX Design: $8,000 - $12,000
• Prototyping & User Testing: $5,000 - $8,000
• Design System Development: $4,000 - $6,000

**Quality Assurance:**
• Comprehensive Testing: $6,000 - $10,000
• Performance Optimization: $4,000 - $7,000
• Security Auditing: $5,000 - $8,000

**Deployment & Support:**
• Infrastructure Setup: $3,000 - $5,000
• Deployment & Migration: $4,000 - $6,000
• Training & Documentation: $3,000 - $5,000
• Post-Launch Support (3 months): $6,000 - $9,000

**Project Management:**
• Planning & Coordination: $8,000 - $12,000
• Client Communication: $4,000 - $6,000
• Risk Management: $3,000 - $5,000

**Total Investment Range: $119,000 - $179,000**

**Payment Schedule:**
• 25% upon project initiation
• 25% at completion of design phase
• 25% at completion of development phase
• 25% upon final delivery and acceptance`
  }

  private generateGenericContent(prompt: string): string {
    return `We're excited to present this proposal for your consideration. Our team has carefully analyzed your requirements and developed a comprehensive approach to deliver exceptional results.

Our solution combines industry best practices with innovative techniques to address your specific needs. We'll work closely with your team throughout the project to ensure alignment with your goals and expectations.

Key highlights of our approach:
• Thorough understanding of your business objectives
• Customized solution tailored to your specific requirements
• Transparent communication and regular progress updates
• Rigorous quality assurance and testing
• Comprehensive documentation and knowledge transfer

We're confident in our ability to deliver this project successfully and look forward to the opportunity to work with you.`
  }
}

// Export singleton instance
export const openai = new MockOpenAIClient(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

// Utility function to generate proposal content
export async function generateProposalContent(
  type: string,
  context: Record<string, any>,
  options: { tone?: string; length?: string } = {}
): Promise<string> {
  const { tone = 'professional', length = 'detailed' } = options

  // Build prompt based on content type and context
  let prompt = ''

  switch (type) {
    case 'description':
      prompt = `Generate a ${length} project description for a ${context.projectType || 'web development'} project in the ${context.industry || 'technology'} industry. The client is ${context.clientName || 'a client'} from ${context.company || 'a company'}. Use a ${tone} tone.`
      break
    case 'requirements':
      prompt = `Generate ${length} project requirements for a ${context.projectType || 'web development'} project. Include functional, technical, and business requirements. The project is for ${context.company || 'a company'} in the ${context.industry || 'technology'} industry. Use a ${tone} tone.`
      break
    case 'timeline':
      prompt = `Generate a ${length} project timeline for a ${context.projectType || 'web development'} project titled "${context.projectTitle || 'New Project'}". Include phases, milestones, and estimated durations. Use a ${tone} tone.`
      break
    case 'budget':
      prompt = `Generate a ${length} budget breakdown for a ${context.projectType || 'web development'} project titled "${context.projectTitle || 'New Project'}". Include development costs, design costs, and other relevant expenses. Use a ${tone} tone.`
      break
    default:
      prompt = `Generate ${length} content for a proposal in a ${tone} tone.`
  }

  // Add context details to prompt
  if (context.techStack && context.techStack.length > 0) {
    prompt += ` The technology stack includes: ${context.techStack.join(', ')}.`
  }

  if (context.existingContent) {
    prompt += ` Here's some existing content to consider: "${context.existingContent}"`
  }

  try {
    const response = await openai.generateCompletion({
      prompt,
      temperature: tone === 'creative' ? 0.8 : 0.6,
      maxTokens: length === 'brief' ? 300 : length === 'detailed' ? 600 : 1000
    })

    return response.content
  } catch (error) {
    console.error('Error generating proposal content:', error)
    throw new Error('Failed to generate content. Please try again.')
  }
}