import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface FormFieldErrorProps {
  error?: string
  className?: string
}

export function FormFieldError({ error, className }: FormFieldErrorProps) {
  if (!error) return null

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm text-destructive mt-1",
      className
    )}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}

interface FormStepErrorSummaryProps {
  errors: Record<string, string>
  className?: string
}

export function FormStepErrorSummary({ errors, className }: FormStepErrorSummaryProps) {
  const errorEntries = Object.entries(errors)
  
  if (errorEntries.length === 0) return null

  return (
    <div className={cn(
      "p-4 bg-destructive/10 border border-destructive/20 rounded-lg",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-destructive" />
        <span className="font-medium text-destructive">
          Please fix the following errors:
        </span>
      </div>
      <ul className="space-y-1 text-sm text-destructive">
        {errorEntries.map(([field, error]) => (
          <li key={field} className="flex items-start gap-2">
            <span className="w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0" />
            <span>{error}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}