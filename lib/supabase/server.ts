import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerClient = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			storage: {
				getItem: (key: string) => {
					const cookieStore = cookies()
					const cookie = cookieStore.get(key)
					return cookie?.value
				},
				setItem: (key: string, value: string) => {
					const cookieStore = cookies()
					cookieStore.set(key, value, {
						maxAge: 60 * 60 * 24 * 7, // 1 week
						httpOnly: true,
						secure: true,
						path: '/',
					})
				},
				removeItem: (key: string) => {
					const cookieStore = cookies()
					cookieStore.set(key, '', {
						maxAge: 0,
						httpOnly: true,
						secure: true,
						path: '/',
					})
				},
			},
		},
	})
}
