'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
	ArrowLeft,
	Loader2,
	CheckCircle,
	AlertCircle,
	Send
} from 'lucide-react'

// Form validation schema
const forgotPasswordSchema = z.object({
	email: z.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)
	const [emailSent, setEmailSent] = useState<string>('')

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			setIsSubmitting(true)
			setSubmitError(null)

			const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
				redirectTo: `${window.location.origin}/auth/reset-password`
			})

			if (error) {
				setSubmitError(error.message)
				return
			}

			setEmailSent(data.email)
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
							Reset Email Sent!
						</CardTitle>
						<CardDescription>
							Check your email for password reset instructions
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Mail className="h-4 w-4" />
							<AlertDescription>
								We've sent a password reset link to <strong>{emailSent}</strong>.
								Please check your email and click the link to reset your password.
							</AlertDescription>
						</Alert>

						<div className="space-y-3 text-sm text-muted-foreground">
							<p>
								<strong>Didn't receive the email?</strong>
							</p>
							<ul className="list-disc list-inside space-y-1 ml-2">
								<li>Check your spam or junk folder</li>
								<li>Make sure you entered the correct email address</li>
								<li>Wait a few minutes for the email to arrive</li>
							</ul>
						</div>

						<div className="flex flex-col gap-2">
							<Button
								onClick={() => {
									setIsSuccess(false)
									setEmailSent('')
									form.reset()
								}}
								variant="outline"
								className="w-full"
							>
								Try Different Email
							</Button>
							<Button
								onClick={() => router.push('/auth/login')}
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
						<Mail className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
					<CardDescription>
						Enter your email address and we'll send you a link to reset your password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
												placeholder="Enter your email address"
												{...field}
												disabled={isSubmitting}
												autoComplete="email"
												autoFocus
											/>
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
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending Reset Link...
									</>
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										Send Reset Link
									</>
								)}
							</Button>

							{/* Back to Login Link */}
							<div className="text-center pt-4 border-t">
								<Button
									type="button"
									variant="ghost"
									className="flex items-center gap-2"
									onClick={() => router.push('/auth/login')}
									disabled={isSubmitting}
								>
									<ArrowLeft className="h-4 w-4" />
									Back to Sign In
								</Button>
							</div>
						</form>
					</Form>

					{/* Help Text */}
					<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
						<h4 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h4>
						<ul className="text-xs text-blue-700 space-y-1">
							<li>• Make sure you're using the email address associated with your account</li>
							<li>• The reset link will expire after 1 hour for security</li>
							<li>• If you continue having issues, contact our support team</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
