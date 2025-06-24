'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { 
  CompleteProposalData, 
  stepSchemas, 
  validateStep,
  completeProposalSchema 
} from '@/lib/validations/proposal'

interface UseProposalFormOptions {
  autoSaveInterval?: number // in milliseconds
  onAutoSave?: (data: Partial<CompleteProposalData>) => Promise<void>
  onSubmit?: (data: CompleteProposalData) => Promise<void>
  initialData?: Partial<CompleteProposalData>
}

interface UseProposalFormReturn {
  // Form instance
  form: UseFormReturn<CompleteProposalData>
  
  // Current step management
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  
  // Step navigation
  canProceedToNext: boolean
  canGoToPrevious: boolean
  nextStep: () => Promise<boolean>
  previousStep: () => void
  goToStep: (step: number) => Promise<boolean>
  
  // Form state
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  
  // Step validation
  stepErrors: Record<number, Record<string, string>>
  validateCurrentStep: () => Promise<boolean>
  getStepValidation: (step: number) => { isValid: boolean; errors: Record<string, string> }
  
  // Auto-save functionality
  isAutoSaving: boolean
  lastAutoSaved: Date | null
  manualSave: () => Promise<void>
  
  // Form submission
  submitForm: () => Promise<void>
  
  // Progress tracking
  completionPercentage: number
  completedSteps: number[]
}

const defaultFormData: CompleteProposalData = {
  // Step 1: Client Information
  clientName: '',
  clientEmail: '',
  company: '',
  industry: '',
  
  // Step 2: Project Details
  projectTitle: '',
  projectType: '',
  description: '',
  requirements: '',
  
  // Step 3: Technical Specifications
  techStack: [],
  integrations: [],
  timeline: '',
  
  // Step 4: Budget & Terms
  budgetRange: '',
  paymentTerms: '',
  projectTimeline: ''
}

export function useProposalForm(options: UseProposalFormOptions = {}): UseProposalFormReturn {
  const {
    autoSaveInterval = 30000, // 30 seconds
    onAutoSave,
    onSubmit,
    initialData = {}
  } = options

  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [stepErrors, setStepErrors] = useState<Record<number, Record<string, string>>>({})
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedDataRef = useRef<string>('')

  // Initialize form with React Hook Form
  const form = useForm<CompleteProposalData>({
    resolver: zodResolver(completeProposalSchema),
    defaultValues: { ...defaultFormData, ...initialData },
    mode: 'onChange'
  })

  const { watch, trigger, getValues, formState } = form
  const { isDirty, isValid } = formState

  // Watch all form values for auto-save
  const watchedValues = watch()

  // Calculate completion percentage
  const completionPercentage = ((currentStep - 1) / (Object.keys(stepSchemas).length - 1)) * 100

  // Get completed steps
  const completedSteps = Object.keys(stepSchemas)
    .map(Number)
    .filter(step => step < currentStep)

  // Validate current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const currentData = getValues()
    const validation = validateStep(currentStep, currentData)
    
    // Update step errors
    setStepErrors(prev => ({
      ...prev,
      [currentStep]: validation.errors
    }))

    // Also trigger React Hook Form validation for the current step
    const stepFields = Object.keys(stepSchemas[currentStep as keyof typeof stepSchemas].shape)
    await trigger(stepFields as any)

    return validation.success
  }, [currentStep, getValues, trigger])

  // Get validation for any step
  const getStepValidation = useCallback((step: number) => {
    const currentData = getValues()
    const validation = validateStep(step, currentData)
    return {
      isValid: validation.success,
      errors: validation.errors
    }
  }, [getValues])

  // Check if can proceed to next step
  const canProceedToNext = currentStep < Object.keys(stepSchemas).length && 
    getStepValidation(currentStep).isValid

  // Check if can go to previous step
  const canGoToPrevious = currentStep > 1

  // Navigate to next step
  const nextStep = useCallback(async (): Promise<boolean> => {
    const isCurrentStepValid = await validateCurrentStep()
    
    if (isCurrentStepValid && currentStep < Object.keys(stepSchemas).length) {
      setCurrentStep(prev => prev + 1)
      return true
    }
    
    return false
  }, [validateCurrentStep, currentStep])

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // Go to specific step
  const goToStep = useCallback(async (step: number): Promise<boolean> => {
    if (step < 1 || step > Object.keys(stepSchemas).length) {
      return false
    }

    // If going forward, validate all steps in between
    if (step > currentStep) {
      for (let i = currentStep; i < step; i++) {
        const validation = getStepValidation(i)
        if (!validation.isValid) {
          setStepErrors(prev => ({
            ...prev,
            [i]: validation.errors
          }))
          return false
        }
      }
    }

    setCurrentStep(step)
    return true
  }, [currentStep, getStepValidation])

  // Auto-save functionality
  const performAutoSave = useCallback(async () => {
    if (!onAutoSave || !user) return

    const currentData = getValues()
    const currentDataString = JSON.stringify(currentData)

    // Only save if data has changed
    if (currentDataString === lastSavedDataRef.current) {
      return
    }

    try {
      setIsAutoSaving(true)
      await onAutoSave(currentData)
      setLastAutoSaved(new Date())
      lastSavedDataRef.current = currentDataString
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [onAutoSave, user, getValues])

  // Manual save
  const manualSave = useCallback(async () => {
    await performAutoSave()
  }, [performAutoSave])

  // Set up auto-save interval
  useEffect(() => {
    if (!onAutoSave || !isDirty) return

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave()
    }, autoSaveInterval)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [watchedValues, isDirty, performAutoSave, autoSaveInterval, onAutoSave])

  // Submit form
  const submitForm = useCallback(async () => {
    if (!onSubmit) return

    try {
      setIsSubmitting(true)

      // Validate all steps
      const allStepsValid = Object.keys(stepSchemas).every(step => {
        const validation = getStepValidation(Number(step))
        return validation.isValid
      })

      if (!allStepsValid) {
        throw new Error('Please complete all required fields')
      }

      // Final form validation
      const isFormValid = await trigger()
      if (!isFormValid) {
        throw new Error('Please fix validation errors')
      }

      const formData = getValues()
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission failed:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, getStepValidation, trigger, getValues])

  // Update step errors when form values change
  useEffect(() => {
    const validation = getStepValidation(currentStep)
    setStepErrors(prev => ({
      ...prev,
      [currentStep]: validation.errors
    }))
  }, [watchedValues, currentStep, getStepValidation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Form instance
    form,
    
    // Current step management
    currentStep,
    setCurrentStep,
    totalSteps: Object.keys(stepSchemas).length,
    
    // Step navigation
    canProceedToNext,
    canGoToPrevious,
    nextStep,
    previousStep,
    goToStep,
    
    // Form state
    isValid,
    isDirty,
    isSubmitting,
    
    // Step validation
    stepErrors,
    validateCurrentStep,
    getStepValidation,
    
    // Auto-save functionality
    isAutoSaving,
    lastAutoSaved,
    manualSave,
    
    // Form submission
    submitForm,
    
    // Progress tracking
    completionPercentage,
    completedSteps
  }
}