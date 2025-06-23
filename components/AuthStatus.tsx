'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, LogOut, Loader2, UserCheck, UserX } from 'lucide-react'

export function AuthStatus() {
	const { user, session, loading, signOut } = useAuth()

	const handleSignOut = async () => {
		const { error } = await signOut()
		if (error) {
			console.error('Sign out error:', error)
		}
	}

	const getStatusIcon = () => {
		if (loading) {
			return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
		}
		if (user) {
			return <UserCheck className="h-5 w-5 text-green-500" />
		}
		return <UserX className="h-5 w-5 text-red-500" />
	}

	const getStatusBadge = () => {
		if (loading) {
			return <Badge variant="secondary">Loading...</Badge>
		}
		if (user) {
			return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Authenticated</Badge>
		}
		return <Badge variant="destructive">Not Authenticated</Badge>
	}

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{getStatusIcon()}
					Authentication Status
				</CardTitle>
				<CardDescription>
					Current authentication state and user information
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Status:</span>
					{getStatusBadge()}
				</div>

				{loading && (
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
						<p className="text-sm text-blue-700">Loading authentication state...</p>
					</div>
				)}

				{!loading && !user && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-md">
						<h4 className="text-sm font-medium text-red-800 mb-2">Not Authenticated</h4>
						<p className="text-sm text-red-700">
							You are not currently signed in. Please sign in to access protected features.
						</p>
					</div>
				)}

				{!loading && user && (
					<div className="space-y-4">
						<div className="p-4 bg-green-50 border border-green-200 rounded-md">
							<h4 className="text-sm font-medium text-green-800 mb-2">Authenticated User</h4>
							<div className="space-y-2 text-sm text-green-700">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span className="font-medium">ID:</span>
									<span className="font-mono text-xs">{user.id}</span>
								</div>
								<div>
									<span className="font-medium">Email:</span> {user.email}
								</div>
								{user.full_name && (
									<div>
										<span className="font-medium">Name:</span> {user.full_name}
									</div>
								)}
								<div>
									<span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
								</div>
							</div>
						</div>

						{session && (
							<div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
								<h4 className="text-sm font-medium text-blue-800 mb-2">Session Information</h4>
								<div className="space-y-1 text-sm text-blue-700">
									<div>
										<span className="font-medium">Expires:</span>{' '}
										{session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Never'}
									</div>
									<div>
										<span className="font-medium">Token Type:</span> Bearer
									</div>
								</div>
							</div>
						)}

						<div className="flex justify-end">
							<Button
								onClick={handleSignOut}
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
							>
								<LogOut className="h-4 w-4" />
								Sign Out
							</Button>
						</div>
					</div>
				)}

				<div className="pt-4 border-t">
					<h4 className="text-sm font-medium mb-2">Context Features:</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>• Real-time authentication state management</li>
						<li>• Automatic session refresh handling</li>
						<li>• Type-safe auth methods and state</li>
						<li>• Custom hooks for granular access</li>
						<li>• Event-driven auth state changes</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}
