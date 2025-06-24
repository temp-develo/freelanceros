import { z } from 'zod'

// Step 1: Client Information Schema
export const clientInformationSchema = z.object({
  clientName: z.string()
    .min(1, 'Client name is required')
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must be less than 100 characters'),
  clientEmail: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  company: z.string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  industry: z.string()
    .min(1, 'Please select an industry')
})

// Step 2: Project Details Schema
export const projectDetailsSchema = z.object({
  projectTitle: z.string()
    .min(1, 'Project title is required')
    .min(5, 'Project title must be at least 5 characters')
    .max(200, 'Project title must be less than 200 characters'),
  projectType: z.string()
    .min(1, 'Please select a project type'),
  description: z.string()
    .min(1, 'Project description is required')
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  requirements: z.string()
    .min(1, 'Project requirements are required')
    .min(30, 'Requirements must be at least 30 characters')
    .max(2000, 'Requirements must be less than 2000 characters')
})

// Step 3: Technical Specifications Schema
export const technicalSpecsSchema = z.object({
  techStack: z.array(z.string())
    .min(1, 'Please select at least one technology')
    .max(10, 'Please select no more than 10 technologies'),
  integrations: z.array(z.string())
    .min(1, 'Please select at least one integration')
    .max(10, 'Please select no more than 10 integrations'),
  timeline: z.string()
    .min(1, 'Please select a development timeline')
})

// Step 4: Budget & Terms Schema
export const budgetTermsSchema = z.object({
  budgetRange: z.string()
    .min(1, 'Please select a budget range'),
  paymentTerms: z.string()
    .min(1, 'Please select payment terms'),
  projectTimeline: z.string()
    .min(1, 'Please select a project timeline')
})

// Complete proposal schema (all steps combined)
export const completeProposalSchema = clientInformationSchema
  .merge(projectDetailsSchema)
  .merge(technicalSpecsSchema)
  .merge(budgetTermsSchema)

// Type definitions
export type ClientInformationData = z.infer<typeof clientInformationSchema>
export type ProjectDetailsData = z.infer<typeof projectDetailsSchema>
export type TechnicalSpecsData = z.infer<typeof technicalSpecsSchema>
export type BudgetTermsData = z.infer<typeof budgetTermsSchema>
export type CompleteProposalData = z.infer<typeof completeProposalSchema>

// Step validation mapping
export const stepSchemas = {
  1: clientInformationSchema,
  2: projectDetailsSchema,
  3: technicalSpecsSchema,
  4: budgetTermsSchema
} as const

// Helper function to validate a specific step
export function validateStep(stepNumber: number, data: Partial<CompleteProposalData>) {
  const schema = stepSchemas[stepNumber as keyof typeof stepSchemas]
  if (!schema) {
    throw new Error(`Invalid step number: ${stepNumber}`)
  }
  
  try {
    schema.parse(data)
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors: fieldErrors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

// Helper function to get field-specific error message
export function getFieldError(fieldName: string, errors: Record<string, string>) {
  return errors[fieldName] || null
}