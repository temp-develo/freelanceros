'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Lock,
	Eye,
	EyeOff,
	Loader2,
	CheckCircle,
	AlertCircle,
	Shield,
	KeyRound
} from 'lucide-react'

// Form validation schema
const resetPasswordSchema = z.object({
	password: z.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
	confirm_password: z.string()
		.min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirm_password, {
	message: "Passwords don't match",
	path: ["confirm_password"]
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Password strength calculation
const calculatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
	let score = 0
	const feedback: string[] = []

	if (password.length >= 8) {
		score += 20
	} else {
		feedback.push('At least 8 characters')
	}

	if (/[a-z]/.test(password)) {
		score += 20
	} else {
		feedback.push('One lowercase letter')
	}

	if (/[A-Z]/.test(password)) {
		score += 20
	} else {
		feedback.push('One uppercase letter')
	}

	if (/[0-9]/.test(password)) {
		score += 20
	} else {
		feedback.push('One number')
	}

	if (/[^a-zA-Z0-9]/.test(password)) {
		score += 20
	} else {
		feedback.push('One special character')
	}

	return { score, feedback }
}

const getStrengthText = (score: number): string => {
	if (score < 40) return 'Weak'
	if (score < 60) return 'Fair'
	if (score < 80) return 'Good'
	return 'Strong'
}

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isValidating, setIsValidating] = useState(true)
	const [isValidToken, setIsValidToken] = useState(false)

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirm_password: ''
		}
	})

	const watchedPassword = form.watch('password')
	const passwordStrength = calculatePasswordStrength(watchedPassword || '')

	// Validate the reset token on component mount
	useEffect(() => {
		const validateToken = async () => {
			try {
				// Check if we have the necessary URL fragments for password reset
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				const accessToken = hashParams.get('access_token')
				const refreshToken = hashParams.get('refresh_token')
				const type = hashParams.get('type')

				if (type === 'recovery' && accessToken && refreshToken) {
					// Set the session with the tokens from the URL
					const { error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken
					})

					if (error) {
						setSubmitError('Invalid or expired reset link. Please request a new password reset.')
						setIsValidToken(false)
					} else {
						setIsValidToken(true)
					}
				} else {
					setSubmitError('Invalid reset link. Please request a new password reset.')
					setIsValidToken(false)
				}
			} catch (err) {
				setSubmitError('An error occurred while validating the reset link.')
				setIsValidToken(false)
			} finally {
				setIsValidating(false)
			}
		}

		validateToken()
	}, [])

	const onSubmit = async (data: ResetPasswordFormData) => {
		try {
			setIsSubmitting(true)
			setSubmitError(null)

			const { error } = await supabase.auth.updateUser({
				password: data.password
			})

			if (error) {
				setSubmitError(error.message)
				return
			}

			setIsSuccess(true)
		} catch (err) {
			setSubmitError('An unexpected error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Loading state while validating token
	if (isValidating) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
					<span className="text-blue-600">Validating reset link...</span>
				</div>
			</div>
		)
	}

	// Success state
	if (isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-green-800">
							Password Reset Successful!
						</CardTitle>
						<CardDescription>
							Your password has been updated successfully
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Shield className="h-4 w-4" />
							<AlertDescription>
								Your password has been securely updated. You can now sign in with your new password.
							</AlertDescription>
						</Alert>

						<Button
							onClick={() => router.push('/auth/login?message=password-reset-success')}
							className="w-full"
						>
							Continue to Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	// Invalid token state
	if (!isValidToken) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
							<AlertCircle className="h-6 w-6 text-red-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-red-800">
							Invalid Reset Link
						</CardTitle>
						<CardDescription>
							This password reset link is invalid or has expired
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								{submitError || 'The password reset link is invalid or has expired. Please request a new one.'}
							</AlertDescription>
						</Alert>

						<div className="flex flex-col gap-2">
							<Button
								onClick={() => router.push('/auth/forgot-password')}
								className="w-full"
							>
								Request New Reset Link
							</Button>
							<Button
								onClick={() => router.push('/auth/login')}
								variant="outline"
								className="w-full"
							>
								Back to Sign In
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
						<KeyRound className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
					<CardDescription>
						Enter your new password below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Lock className="h-4 w-4" />
											New Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="Enter your new password"
													{...field}
													disabled={isSubmitting}
													autoComplete="new-password"
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

										{/* Password Strength Indicator */}
										{watchedPassword && (
											<div className="space-y-2">
												<div className="flex items-center justify-between text-sm">
													<span className="flex items-center gap-1">
														<Shield className="h-3 w-3" />
														Password Strength:
													</span>
													<span className={`font-medium ${passwordStrength.score < 40 ? 'text-red-600' :
														passwordStrength.score < 60 ? 'text-orange-600' :
															passwordStrength.score < 80 ? 'text-yellow-600' :
																'text-green-600'
														}`}>
														{getStrengthText(passwordStrength.score)}
													</span>
												</div>
												<Progress
													value={passwordStrength.score}
													className="h-2"
												/>
												{passwordStrength.feedback.length > 0 && (
													<div className="text-xs text-muted-foreground">
														<p className="mb-1">Missing requirements:</p>
														<ul className="list-disc list-inside space-y-0.5">
															{passwordStrength.feedback.map((item, index) => (
																<li key={index}>{item}</li>
															))}
														</ul>
													</div>
												)}
											</div>
										)}
									</FormItem>
								)}
							/>

							{/* Confirm Password Field */}
							<FormField
								control={form.control}
								name="confirm_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Lock className="h-4 w-4" />
											Confirm New Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showConfirmPassword ? 'text' : 'password'}
													placeholder="Confirm your new password"
													{...field}
													disabled={isSubmitting}
													autoComplete="new-password"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													disabled={isSubmitting}
												>
													{showConfirmPassword ? (
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

							{/* Error Alert */}
							{submitError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										<strong>Reset Failed</strong><br />
										{submitError}
									</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting || passwordStrength.score < 80}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating Password...
									</>
								) : (
									<>
										<Shield className="mr-2 h-4 w-4" />
										Update Password
									</>
								)}
							</Button>

							{/* Help Text */}
							<div className="text-center pt-4 border-t">
								<p className="text-sm text-muted-foreground">
									Remember your password?{' '}
									<Button
										type="button"
										variant="link"
										className="p-0 h-auto font-normal"
										onClick={() => router.push('/auth/login')}
										disabled={isSubmitting}
									>
										Sign in instead
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
