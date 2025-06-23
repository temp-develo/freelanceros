import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/profile', '/projects', '/invoices', '/messages']
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
const publicRoutes = ['/', '/auth-test', '/test-connection']

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	const supabase = createMiddlewareClient({ req, res })

	// Get the pathname
	const pathname = req.nextUrl.pathname

	// Skip middleware for static files and API routes
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.includes('.') ||
		pathname.startsWith('/favicon')
	) {
		return res
	}

	try {
		// Get the session
		const {
			data: { session },
			error
		} = await supabase.auth.getSession()

		// If there's an error getting the session, redirect to login
		if (error) {
			console.error('Middleware auth error:', error)
			if (protectedRoutes.some(route => pathname.startsWith(route))) {
				const redirectUrl = new URL('/login', req.url)
				redirectUrl.searchParams.set('redirect', pathname)
				return NextResponse.redirect(redirectUrl)
			}
			return res
		}

		const isAuthenticated = !!session?.user
		const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
		const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
		const isPublicRoute = publicRoutes.includes(pathname)

		// Handle protected routes
		if (isProtectedRoute && !isAuthenticated) {
			const redirectUrl = new URL('/login', req.url)
			redirectUrl.searchParams.set('redirect', pathname)
			return NextResponse.redirect(redirectUrl)
		}

		// Handle auth routes (redirect authenticated users away)
		if (isAuthRoute && isAuthenticated) {
			// Check if there's a redirect parameter
			const redirectTo = req.nextUrl.searchParams.get('redirect') || '/dashboard'
			return NextResponse.redirect(new URL(redirectTo, req.url))
		}

		// Handle root route
		if (pathname === '/' && isAuthenticated) {
			return NextResponse.redirect(new URL('/dashboard', req.url))
		}

		return res
	} catch (error) {
		console.error('Middleware error:', error)
		// On error, allow the request to continue but log the issue
		return res
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
