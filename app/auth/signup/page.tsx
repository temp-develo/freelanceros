'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	CheckCircle,
	XCircle,
	Loader2,
	Shield,
	AlertCircle
} from 'lucide-react'

// Form validation schema
const signUpSchema = z.object({
	full_name: z.string()
		.min(1, 'Full name is required')
		.min(2, 'Full name must be at least 2 characters')
		.max(50, 'Full name must be less than 50 characters'),
	email: z.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
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

type SignUpFormData = z.infer<typeof signUpSchema>

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

const getStrengthColor = (score: number): string => {
	if (score < 40) return 'bg-red-500'
	if (score < 60) return 'bg-orange-500'
	if (score < 80) return 'bg-yellow-500'
	return 'bg-green-500'
}

const getStrengthText = (score: number): string => {
	if (score < 40) return 'Weak'
	if (score < 60) return 'Fair'
	if (score < 80) return 'Good'
	return 'Strong'
}

export default function SignUpPage() {
	const router = useRouter()
	const { signUp, loading: authLoading } = useAuth()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			full_name: '',
			email: '',
			password: '',
			confirm_password: ''
		}
	})

	const watchedPassword = form.watch('password')
	const passwordStrength = calculatePasswordStrength(watchedPassword || '')

	const onSubmit = async (data: SignUpFormData) => {
		try {
			setIsSubmitting(true)
			setSubmitError(null)

			const { error } = await signUp(data.email, data.password, data.full_name)

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

	if (isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-green-800">
							Account Created Successfully!
						</CardTitle>
						<CardDescription>
							Please check your email to verify your account
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Mail className="h-4 w-4" />
							<AlertDescription>
								We've sent a verification email to <strong>{form.getValues('email')}</strong>.
								Please click the link in the email to activate your account.
							</AlertDescription>
						</Alert>
						<div className="text-center space-y-2">
							<p className="text-sm text-muted-foreground">
								Didn't receive the email? Check your spam folder or contact support.
							</p>
							<Button
								variant="outline"
								onClick={() => router.push('/auth/login')}
								className="w-full"
							>
								Go to Sign In
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
						<User className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
					<CardDescription>
						Join our freelance management platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* Full Name Field */}
							<FormField
								control={form.control}
								name="full_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<User className="h-4 w-4" />
											Full Name
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your full name"
												{...field}
												disabled={isSubmitting || authLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
												disabled={isSubmitting || authLoading}
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
													placeholder="Create a strong password"
													{...field}
													disabled={isSubmitting || authLoading}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}
													disabled={isSubmitting || authLoading}
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
											Confirm Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showConfirmPassword ? 'text' : 'password'}
													placeholder="Confirm your password"
													{...field}
													disabled={isSubmitting || authLoading}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													disabled={isSubmitting || authLoading}
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
									<AlertDescription>{submitError}</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting || authLoading || passwordStrength.score < 80}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Account...
									</>
								) : (
									'Create Account'
								)}
							</Button>

							{/* Sign In Link */}
							<div className="text-center">
								<p className="text-sm text-muted-foreground">
									Already have an account?{' '}
									<Button
										variant="link"
										className="p-0 h-auto font-normal"
										onClick={() => router.push('/auth/login')}
										disabled={isSubmitting || authLoading}
									>
										Sign in here
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
