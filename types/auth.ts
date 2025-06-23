export interface User {
	id: string
	email: string
	full_name?: string
	avatar_url?: string
	created_at: string
}

export interface Session {
	access_token: string
	refresh_token: string
	expires_at: number
	user: User
}

export interface AuthError {
	message: string
	status: number
}
