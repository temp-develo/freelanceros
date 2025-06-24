import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// Base skeleton component with consistent styling
interface BaseSkeletonProps {
  className?: string
  children?: React.ReactNode
}

function BaseSkeleton({ className, children }: BaseSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  )
}

// Proposal Table Skeleton - for proposals list loading
export function ProposalTableSkeleton({ 
  rows = 5, 
  className 
}: { 
  rows?: number
  className?: string 
}) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card">
        <div className="border-b">
          <div className="grid grid-cols-6 p-4">
            <Skeleton className="h-4 w-32 col-span-2" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-2 w-full max-w-md">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Proposal Form Skeleton - for form loading states
export function ProposalFormSkeleton({ 
  fields = 4, 
  className 
}: { 
  fields?: number
  className?: string 
}) {
  return (
    <BaseSkeleton className={cn("space-y-8", className)}>
      {/* Form Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      
      {/* Progress Indicator */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </BaseSkeleton>
  )
}

// Proposal Preview Skeleton - for proposal preview loading
export function ProposalPreviewSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Section 2 */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Section 3 */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          
          {/* Section 4 */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="p-4 border rounded-md space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t flex justify-between">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </BaseSkeleton>
  )
}

// AI Generation Skeleton - for AI generation loading
export function AIGenerationSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        
        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        
        {/* Content Area */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
          
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        
        {/* Suggestions */}
        <div className="p-4 rounded-md border space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between">
          <Skeleton className="h-10 w-28 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Proposal Card Skeleton - for mobile view
export function ProposalCardSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <div className="flex justify-between text-sm pt-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Proposal List Skeleton - multiple cards for mobile view
export function ProposalListSkeleton({ 
  count = 3, 
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <BaseSkeleton className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProposalCardSkeleton key={i} />
      ))}
    </BaseSkeleton>
  )
}