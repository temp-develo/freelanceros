import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from '@/lib/error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'FreelancerOS Design System',
	description: 'A beautiful design system built with Flexoki colors and Next.js',
	keywords: ['design system', 'react', 'nextjs', 'tailwind', 'components', 'ui'],
	authors: [{ name: 'FreelancerOS Team' }],
	viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased min-h-screen`}>
				<ErrorBoundary>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange={false}
					>
						<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20 transition-theme">
							<AuthProvider>
								{children}
							</AuthProvider>
						</div>
						<Toaster
							position="bottom-right"
							toastOptions={{
								duration: 4000,
								style: {
									background: 'hsl(var(--card))',
									color: 'hsl(var(--card-foreground))',
									border: '1px solid hsl(var(--border))',
								},
							}}
						/>
					</ThemeProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
