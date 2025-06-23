'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	Loader2,
	LogIn,
	AlertCircle,
	CheckCircle,
	UserCheck
} from 'lucide-react'

// Form validation schema
const loginSchema = z.object({
	email: z.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	password: z.string()
		.min(1, 'Password is required')
		.min(6, 'Password must be at least 6 characters'),
	remember_me: z.boolean().default(false)
})

type LoginFormData = z.infer<typeof loginSchema>

// Error message mapping for better UX
const getErrorMessage = (error: string): { title: string; message: string; type: 'error' | 'warning' } => {
	const errorLower = error.toLowerCase()

	if (errorLower.includes('invalid login credentials') || errorLower.includes('invalid credentials')) {
		return {
			title: 'Invalid Credentials',
			message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
			type: 'error'
		}
	}

	if (errorLower.includes('email not confirmed') || errorLower.includes('unconfirmed')) {
		return {
			title: 'Email Not Confirmed',
			message: 'Please check your email and click the confirmation link before signing in.',
			type: 'warning'
		}
	}

	if (errorLower.includes('too many requests') || errorLower.includes('rate limit')) {
		return {
			title: 'Too Many Attempts',
			message: 'Too many login attempts. Please wait a few minutes before trying again.',
			type: 'error'
		}
	}

	if (errorLower.includes('network') || errorLower.includes('fetch')) {
		return {
			title: 'Connection Error',
			message: 'Unable to connect to the server. Please check your internet connection and try again.',
			type: 'error'
		}
	}

	return {
		title: 'Sign In Error',
		message: error || 'An unexpected error occurred. Please try again.',
		type: 'error'
	}
}

export default function LoginPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { signIn, loading: authLoading, user } = useAuth()
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	// Redirect URL from query params
	const redirectTo = searchParams.get('redirect') || '/dashboard'
	const message = searchParams.get('message')

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			remember_me: false
		}
	})

	// Handle success messages from URL params
	useEffect(() => {
		if (message === 'password-reset-success') {
			setSuccessMessage('Your password has been reset successfully. Please sign in with your new password.')
		}
	}, [message])

	// Redirect if already authenticated
	useEffect(() => {
		if (!authLoading && user) {
			router.push(redirectTo)
		}
	}, [user, authLoading, router, redirectTo])

	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsSubmitting(true)
			setSubmitError(null)

			const { error } = await signIn(data.email, data.password)

			if (error) {
				setSubmitError(error.message)
				return
			}

			// Store remember me preference (you can implement persistent sessions here)
			if (data.remember_me) {
				localStorage.setItem('remember_me', 'true')
			} else {
				localStorage.removeItem('remember_me')
			}

			// Successful login - redirect will happen via useEffect
		} catch (err) {
			setSubmitError('An unexpected error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Show loading state while checking authentication
	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
					<span className="text-blue-600">Loading...</span>
				</div>
			</div>
		)
	}

	// Don't render login form if user is already authenticated
	if (user) {
		return null
	}

	const errorInfo = submitError ? getErrorMessage(submitError) : null

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
						<LogIn className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
					<CardDescription>
						Sign in to your freelance management account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* Success Message */}
							{successMessage && (
								<Alert>
									<CheckCircle className="h-4 w-4" />
									<AlertDescription>
										{successMessage}
									</AlertDescription>
								</Alert>
							)}

							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Mail className="h-4 w-4" />
											Email Address
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter your email"
												{...field}
												disabled={isSubmitting}
												autoComplete="email"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Lock className="h-4 w-4" />
											Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="Enter your password"
													{...field}
													disabled={isSubmitting}
													autoComplete="current-password"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}
													disabled={isSubmitting}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Remember Me Checkbox */}
							<FormField
								control={form.control}
								name="remember_me"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isSubmitting}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-sm font-normal cursor-pointer">
												Remember me for 30 days
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>

							{/* Error Alert */}
							{errorInfo && (
								<Alert variant={errorInfo.type === 'error' ? 'destructive' : 'default'}>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										<strong>{errorInfo.title}</strong><br />
										{errorInfo.message}
									</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing In...
									</>
								) : (
									<>
										<UserCheck className="mr-2 h-4 w-4" />
										Sign In
									</>
								)}
							</Button>

							{/* Forgot Password Link */}
							<div className="text-center">
								<Button
									type="button"
									variant="link"
									className="p-0 h-auto font-normal text-sm"
									onClick={() => router.push('/auth/forgot-password')}
									disabled={isSubmitting}
								>
									Forgot your password?
								</Button>
							</div>

							{/* Sign Up Link */}
							<div className="text-center pt-4 border-t">
								<p className="text-sm text-muted-foreground">
									Don't have an account?{' '}
									<Button
										type="button"
										variant="link"
										className="p-0 h-auto font-normal"
										onClick={() => router.push('/auth/signup')}
										disabled={isSubmitting}
									>
										Create one here
									</Button>
								</p>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
