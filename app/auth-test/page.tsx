'use client'

import { AuthStatus } from '@/components/AuthStatus'
import { AuthProvider } from '@/contexts/AuthContext'

export default function AuthTestPage() {
	return (
		<AuthProvider>
			<div className="container mx-auto py-8">
				<div className="max-w-4xl mx-auto space-y-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-2">Authentication Context Test</h1>
						<p className="text-muted-foreground">
							Testing the authentication context system with real-time state management
						</p>
					</div>

					<AuthStatus />

					<div className="grid gap-6 md:grid-cols-2">
						<div className="p-6 border rounded-lg">
							<h3 className="font-semibold mb-3">Available Hooks</h3>
							<ul className="space-y-2 text-sm">
								<li><code className="bg-muted px-2 py-1 rounded">useAuth()</code> - Complete auth context</li>
								<li><code className="bg-muted px-2 py-1 rounded">useUser()</code> - User data only</li>
								<li><code className="bg-muted px-2 py-1 rounded">useSession()</code> - Session data only</li>
								<li><code className="bg-muted px-2 py-1 rounded">useAuthLoading()</code> - Loading state</li>
								<li><code className="bg-muted px-2 py-1 rounded">useIsAuthenticated()</code> - Auth status</li>
								<li><code className="bg-muted px-2 py-1 rounded">useAuthActions()</code> - Auth methods</li>
							</ul>
						</div>

						<div className="p-6 border rounded-lg">
							<h3 className="font-semibold mb-3">Context Methods</h3>
							<ul className="space-y-2 text-sm">
								<li><code className="bg-muted px-2 py-1 rounded">signIn(email, password)</code></li>
								<li><code className="bg-muted px-2 py-1 rounded">signUp(email, password, name?)</code></li>
								<li><code className="bg-muted px-2 py-1 rounded">signOut()</code></li>
								<li><code className="bg-muted px-2 py-1 rounded">resetPassword(email)</code></li>
							</ul>
						</div>
					</div>

					<div className="p-6 border rounded-lg bg-muted/50">
						<h3 className="font-semibold mb-3">How to Use</h3>
						<div className="space-y-3 text-sm">
							<p>
								1. Wrap your app with <code className="bg-background px-2 py-1 rounded">AuthProvider</code>
							</p>
							<p>
								2. Use hooks in any component: <code className="bg-background px-2 py-1 rounded">const {`{ user, loading }`} = useAuth()</code>
							</p>
							<p>
								3. The context automatically manages session state and listens for auth changes
							</p>
							<p>
								4. All auth methods return <code className="bg-background px-2 py-1 rounded">{`{ error: AuthError | null }`}</code>
							</p>
						</div>
					</div>
				</div>
			</div>
		</AuthProvider>
	)
}
