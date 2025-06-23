'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User, Session, AuthError } from '@/types/auth'
import type { AuthChangeEvent, AuthSession } from '@supabase/supabase-js'

interface AuthContextType {
	user: User | null
	session: Session | null
	loading: boolean
	signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
	signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
	signOut: () => Promise<{ error: AuthError | null }>
	resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)

	// Convert Supabase session to our Session type
	const convertSession = (supabaseSession: AuthSession | null): Session | null => {
		if (!supabaseSession) return null

		return {
			access_token: supabaseSession.access_token,
			refresh_token: supabaseSession.refresh_token,
			expires_at: supabaseSession.expires_at || 0,
			user: {
				id: supabaseSession.user.id,
				email: supabaseSession.user.email || '',
				full_name: supabaseSession.user.user_metadata?.full_name,
				avatar_url: supabaseSession.user.user_metadata?.avatar_url,
				created_at: supabaseSession.user.created_at
			}
		}
	}

	// Convert Supabase auth error to our AuthError type
	const convertError = (error: any): AuthError => {
		return {
			message: error?.message || 'An unknown error occurred',
			status: error?.status || 500
		}
	}

	// Sign in with email and password
	const signIn = async (email: string, password: string) => {
		try {
			setLoading(true)
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			})

			if (error) {
				return { error: convertError(error) }
			}

			return { error: null }
		} catch (err) {
			return { error: convertError(err) }
		} finally {
			setLoading(false)
		}
	}

	// Sign up with email and password
	const signUp = async (email: string, password: string, fullName?: string) => {
		try {
			setLoading(true)
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullName
					}
				}
			})

			if (error) {
				return { error: convertError(error) }
			}

			return { error: null }
		} catch (err) {
			return { error: convertError(err) }
		} finally {
			setLoading(false)
		}
	}

	// Sign out
	const signOut = async () => {
		try {
			setLoading(true)
			const { error } = await supabase.auth.signOut()

			if (error) {
				return { error: convertError(error) }
			}

			return { error: null }
		} catch (err) {
			return { error: convertError(err) }
		} finally {
			setLoading(false)
		}
	}

	// Reset password
	const resetPassword = async (email: string) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email)

			if (error) {
				return { error: convertError(error) }
			}

			return { error: null }
		} catch (err) {
			return { error: convertError(err) }
		}
	}

	// Handle auth state changes
	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			try {
				const { data: { session: initialSession } } = await supabase.auth.getSession()
				const convertedSession = convertSession(initialSession)

				setSession(convertedSession)
				setUser(convertedSession?.user || null)
			} catch (error) {
				console.error('Error getting initial session:', error)
			} finally {
				setLoading(false)
			}
		}

		getInitialSession()

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (event: AuthChangeEvent, supabaseSession: AuthSession | null) => {
				console.log('Auth state changed:', event, supabaseSession?.user?.email)

				const convertedSession = convertSession(supabaseSession)
				setSession(convertedSession)
				setUser(convertedSession?.user || null)

				// Only set loading to false after the initial INITIAL_SESSION event
				if (event === 'INITIAL_SESSION') {
					setLoading(false)
				}
			}
		)

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const value: AuthContextType = {
		user,
		session,
		loading,
		signIn,
		signUp,
		signOut,
		resetPassword
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuthContext() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider')
	}
	return context
}
