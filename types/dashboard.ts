// Dashboard-specific TypeScript types

export interface DashboardStats {
  activeProjects: number
  pendingProposals: number
  monthlyRevenue: number
  hoursTracked: number
  // Additional stats with change indicators
  activeProjectsChange: number
  pendingProposalsChange: number
  monthlyRevenueChange: number
  hoursTrackedChange: number
}

export interface RecentActivity {
  id: string
  type: 'proposal_sent' | 'project_completed' | 'payment_received' | 'meeting_scheduled' | 'invoice_sent' | 'project_started' | 'milestone_reached'
  title: string
  description: string
  timestamp: string
  metadata?: {
    projectId?: string
    clientId?: string
    amount?: number
    proposalId?: string
    invoiceId?: string
  }
}

export interface UpcomingDeadline {
  id: string
  projectId: string
  projectName: string
  clientName: string
  taskName: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  progress: number
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  estimatedHours?: number
  completedHours?: number
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  startDate: string
  endDate?: string
  budget?: number
  hourlyRate?: number
  totalHours?: number
  completedHours?: number
  progress: number
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface Proposal {
  id: string
  title: string
  clientId: string
  clientName: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  amount: number
  currency: string
  validUntil?: string
  sentAt?: string
  viewedAt?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
  status: 'active' | 'inactive'
  totalProjects: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  projectId: string
  projectName: string
  description: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  hourlyRate?: number
  billable: boolean
  date: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  invoiceNumber: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  amount: number
  currency: string
  dueDate: string
  sentAt?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

// Hook return types with real-time support
export interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  refetchSilent?: () => Promise<void>
}

export interface UseRecentActivityReturn {
  activities: RecentActivity[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  refetchSilent?: () => Promise<void>
  hasMore: boolean
  loadMore: () => Promise<void>
}

export interface UseUpcomingDeadlinesReturn {
  deadlines: UpcomingDeadline[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  refetchSilent?: () => Promise<void>
  overdueTasks: number
  urgentTasks: number
}

// Real-time subscription types
export interface RealtimeSubscriptionStatus {
  isConnected: boolean
  activeSubscriptions: number
}

// API response types
export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
}