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

// Stat Card Skeleton - matches the stats cards in dashboard
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {/* Header with title and icon */}
        <div className="flex items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        
        {/* Main value */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-20" />
          
          {/* Change indicators and description */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-3 w-3 rounded-sm" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          
          {/* Additional description */}
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Activity Item Skeleton - for recent activity list items
export function ActivityItemSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="flex items-start space-x-4 p-3 rounded-lg">
        {/* Icon container */}
        <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        
        {/* Timestamp */}
        <Skeleton className="h-3 w-16 flex-shrink-0" />
      </div>
    </BaseSkeleton>
  )
}

// Deadline Item Skeleton - for upcoming deadline items
export function DeadlineItemSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="space-y-3 p-3 border rounded-lg">
        {/* Header with project info and badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Table Row Skeleton - for data tables
export function TableRowSkeleton({ 
  columns = 4, 
  className 
}: { 
  columns?: number
  className?: string 
}) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <tr className="border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <td key={index} className="p-4">
            <Skeleton className={cn(
              "h-4",
              // Vary the width for more realistic appearance
              index === 0 ? "w-32" :
              index === 1 ? "w-24" :
              index === 2 ? "w-20" :
              "w-16"
            )} />
          </td>
        ))}
      </tr>
    </BaseSkeleton>
  )
}

// Table Header Skeleton - for table headers
export function TableHeaderSkeleton({ 
  columns = 4, 
  className 
}: { 
  columns?: number
  className?: string 
}) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <tr className="border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <th key={index} className="p-4 text-left">
            <Skeleton className="h-4 w-20" />
          </th>
        ))}
      </tr>
    </BaseSkeleton>
  )
}

// Complete Table Skeleton - combines header and rows
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className,
  showHeader = true 
}: { 
  rows?: number
  columns?: number
  className?: string
  showHeader?: boolean
}) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-md border">
        <table className="w-full">
          {showHeader && (
            <thead>
              <TableHeaderSkeleton columns={columns} />
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </BaseSkeleton>
  )
}

// Card Container Skeleton - for card-based layouts
export function CardSkeleton({ 
  className,
  showHeader = true,
  showFooter = false,
  contentLines = 3
}: { 
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  contentLines?: number
}) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="rounded-lg border bg-card shadow-sm">
        {showHeader && (
          <div className="p-6 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        )}
        
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {Array.from({ length: contentLines }).map((_, index) => (
              <Skeleton 
                key={index} 
                className={cn(
                  "h-4",
                  // Last line is typically shorter
                  index === contentLines - 1 ? "w-3/4" : "w-full"
                )} 
              />
            ))}
          </div>
        </div>
        
        {showFooter && (
          <div className="px-6 py-4 border-t">
            <Skeleton className="h-9 w-24" />
          </div>
        )}
      </div>
    </BaseSkeleton>
  )
}

// Quick Actions Skeleton - for the quick actions section
export function QuickActionSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("", className)}>
      <div className="w-full p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </BaseSkeleton>
  )
}

// Dashboard Grid Skeleton - complete dashboard loading state
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <BaseSkeleton className={cn("space-y-8", className)}>
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Activity */}
        <div className="lg:col-span-8">
          <CardSkeleton contentLines={5} showHeader />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <CardSkeleton contentLines={4} showHeader />
          <CardSkeleton contentLines={3} showHeader />
        </div>
      </div>
    </BaseSkeleton>
  )
}

// List Skeleton - for generic lists
export function ListSkeleton({ 
  items = 5, 
  className,
  showAvatar = false 
}: { 
  items?: number
  className?: string
  showAvatar?: boolean
}) {
  return (
    <BaseSkeleton className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          {showAvatar && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </BaseSkeleton>
  )
}

// Form Skeleton - for form loading states
export function FormSkeleton({ 
  fields = 4, 
  className,
  showSubmitButton = true 
}: { 
  fields?: number
  className?: string
  showSubmitButton?: boolean
}) {
  return (
    <BaseSkeleton className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      
      {showSubmitButton && (
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      )}
    </BaseSkeleton>
  )
}

// Navigation Skeleton - for sidebar/navigation loading
export function NavigationSkeleton({ 
  items = 7, 
  className 
}: { 
  items?: number
  className?: string
}) {
  return (
    <BaseSkeleton className={cn("space-y-2", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
          <Skeleton className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-4 w-24 flex-1" />
          {/* Occasionally show a badge */}
          {index % 3 === 0 && <Skeleton className="h-4 w-4 rounded-full" />}
        </div>
      ))}
    </BaseSkeleton>
  )
}