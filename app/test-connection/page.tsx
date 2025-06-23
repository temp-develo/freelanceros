'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestConnection() {
	const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading')
	const [errorMessage, setErrorMessage] = useState<string>('')

	useEffect(() => {
		const testConnection = async () => {
			try {
				// Test basic connection to Supabase
				const { data, error } = await supabase.from('profiles').select('email').limit(1)

				if (error) {
					// If migrations table doesn't exist, that's actually fine - it means Supabase is connected
					// but no migrations have been run yet
					if (error.message.includes('relation "_supabase_migrations" does not exist')) {
						setConnectionStatus('connected')
					} else {
						setConnectionStatus('error')
						setErrorMessage(error.message)
					}
				} else {
					setConnectionStatus('connected')
				}
			} catch (err) {
				setConnectionStatus('error')
				setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred')
			}
		}

		testConnection()
	}, [])

	const getStatusIcon = () => {
		switch (connectionStatus) {
			case 'loading':
				return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
			case 'connected':
				return <CheckCircle className="h-5 w-5 text-green-500" />
			case 'error':
				return <XCircle className="h-5 w-5 text-red-500" />
		}
	}

	const getStatusBadge = () => {
		switch (connectionStatus) {
			case 'loading':
				return <Badge variant="secondary">Testing...</Badge>
			case 'connected':
				return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
			case 'error':
				return <Badge variant="destructive">Error</Badge>
		}
	}

	return (
		<div className="container mx-auto py-8">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getStatusIcon()}
							Supabase Connection Test
						</CardTitle>
						<CardDescription>
							Testing connection to your Supabase instance
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Connection Status:</span>
							{getStatusBadge()}
						</div>

						{connectionStatus === 'error' && (
							<div className="p-4 bg-red-50 border border-red-200 rounded-md">
								<h4 className="text-sm font-medium text-red-800 mb-2">Connection Error</h4>
								<p className="text-sm text-red-700">{errorMessage}</p>
								<div className="mt-3 text-xs text-red-600">
									<p>Make sure you have:</p>
									<ul className="list-disc list-inside mt-1 space-y-1">
										<li>Created a .env.local file with your Supabase credentials</li>
										<li>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
										<li>Restarted your development server after adding environment variables</li>
									</ul>
								</div>
							</div>
						)}

						{connectionStatus === 'connected' && (
							<div className="p-4 bg-green-50 border border-green-200 rounded-md">
								<h4 className="text-sm font-medium text-green-800 mb-2">Connection Successful</h4>
								<p className="text-sm text-green-700">
									Your application is successfully connected to Supabase and ready for authentication setup.
								</p>
							</div>
						)}

						<div className="pt-4 border-t">
							<h4 className="text-sm font-medium mb-2">Next Steps:</h4>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Set up your authentication tables in Supabase</li>
								<li>• Configure authentication providers (email/password, OAuth, etc.)</li>
								<li>• Create authentication components (login, signup, etc.)</li>
								<li>• Set up Row Level Security (RLS) policies</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
