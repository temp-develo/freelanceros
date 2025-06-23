'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import type { User, Session } from '@/types/auth'

// Main auth hook with all functionality
export function useAuth() {
	const context = useAuthContext()
	return context
}

// Hook for just the user data
export function useUser(): User | null {
	const { user } = useAuthContext()
	return user
}

// Hook for just the session data
export function useSession(): Session | null {
	const { session } = useAuthContext()
	return session
}

// Hook for loading state
export function useAuthLoading(): boolean {
	const { loading } = useAuthContext()
	return loading
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
	const { user, loading } = useAuthContext()
	return !loading && user !== null
}

// Hook for auth methods only
export function useAuthActions() {
	const { signIn, signUp, signOut, resetPassword } = useAuthContext()
	return {
		signIn,
		signUp,
		signOut,
		resetPassword
	}
}
