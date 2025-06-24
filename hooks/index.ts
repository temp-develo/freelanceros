// Export all hooks for easier imports
export { useProposals } from './useProposals'
export { useProposal } from './useProposal'
export { useCreateProposal } from './useCreateProposal'
export { useUpdateProposal } from './useUpdateProposal'
export { useDeleteProposal } from './useDeleteProposal'

// Re-export existing hooks
export { useAuth, useUser, useSession, useAuthLoading, useIsAuthenticated, useAuthActions } from './useAuth'
export { useDashboard } from './useDashboard'
export { useDashboardStats } from './useDashboardStats'
export { useRecentActivity } from './useRecentActivity'
export { useUpcomingDeadlines } from './useUpcomingDeadlines'
export { useRealtimeDashboard } from './useRealtimeDashboard'
export { useProposalForm } from './useProposalForm'
export { useLoading, useMultipleLoading } from './use-loading'