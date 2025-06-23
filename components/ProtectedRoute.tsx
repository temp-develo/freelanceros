'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
	children: React.ReactNode
	fallback?: React.ReactNode
	redirectTo?: string
	requireAuth?: boolean
}

export function ProtectedRoute({
	children,
	fallback,
	redirectTo = '/login',
	requireAuth = true
}: ProtectedRouteProps) {
	const { user, loading, session } = useAuth()
	const router = useRouter()
	const [isChecking, setIsChecking] = useState(true)
	const [shouldRedirect, setShouldRedirect] = useState(false)

	useEffect(() => {
		// Wait for auth to finish loading
		if (loading) {
			return
		}

		const isAuthenticated = !!user && !!session

		if (requireAuth && !isAuthenticated) {
			setShouldRedirect(true)
			// Add current path as redirect parameter
			const currentPath = window.location.pathname
			const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`

			// Small delay to prevent flash
			setTimeout(() => {
				router.push(redirectUrl)
			}, 100)
		} else {
			setIsChecking(false)
		}
	}, [user, session, loading, requireAuth, redirectTo, router])

	// Show loading state while checking authentication
	if (loading || isChecking) {
		return fallback || <ProtectedRouteLoader />
	}

	// Show redirect message if redirecting
	if (shouldRedirect) {
		return <ProtectedRouteRedirect />
	}

	// If we require auth and user is not authenticated, don't render children
	if (requireAuth && !user) {
		return <ProtectedRouteUnauthorized redirectTo={redirectTo} />
	}

	// If we don't require auth or user is authenticated, render children
	return <>{children}</>
}

// Default loading component
function ProtectedRouteLoader() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center justify-center p-8">
					<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
						<Shield className="h-6 w-6 text-blue-600" />
					</div>
					<div className="flex items-center gap-2 mb-2">
						<Loader2 className="h-5 w-5 animate-spin text-blue-600" />
						<span className="text-blue-600 font-medium">Verifying Access</span>
					</div>
					<p className="text-sm text-muted-foreground text-center">
						Please wait while we check your authentication status...
					</p>
				</CardContent>
			</Card>
		</div>
	)
}

// Redirect message component
function ProtectedRouteRedirect() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center justify-center p-8">
					<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
						<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
					</div>
					<div className="text-center">
						<h3 className="font-semibold text-blue-900 mb-2">Redirecting...</h3>
						<p className="text-sm text-muted-foreground">
							Taking you to the sign-in page
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

// Unauthorized access component
function ProtectedRouteUnauthorized({ redirectTo }: { redirectTo: string }) {
	const router = useRouter()

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-orange-100">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center justify-center p-8">
					<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<AlertCircle className="h-6 w-6 text-red-600" />
					</div>
					<div className="text-center mb-6">
						<h3 className="font-semibold text-red-900 mb-2">Access Denied</h3>
						<p className="text-sm text-muted-foreground">
							You need to be signed in to access this page
						</p>
					</div>
					<Button
						onClick={() => router.push(redirectTo)}
						className="w-full"
					>
						Sign In
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

// Hook for checking if current route is protected
export function useRouteProtection() {
	const { user, loading, session } = useAuth()

	return {
		isAuthenticated: !!user && !!session,
		isLoading: loading,
		user,
		session
	}
}
