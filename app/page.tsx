'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { ArrowRight, Palette, Zap, Shield, Smartphone, Code, Eye } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 w-full max-w-4xl">
          <div className="space-y-4">
            <Skeleton className="h-16 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-center gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg" />
            <span className="font-bold text-xl">FreelancerOS</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/showcase/core" className="text-sm font-medium hover:text-primary transition-colors">
              Components
            </Link>
            <Link href="/showcase/themes" className="text-sm font-medium hover:text-primary transition-colors">
              Themes
            </Link>
            <Link href="/components" className="text-sm font-medium hover:text-primary transition-colors">
              Documentation
            </Link>
          </nav>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-24 mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
                FreelancerOS
              </h1>
              <h2 className="text-2xl md:text-3xl font-light text-muted-foreground">
                Design System
              </h2>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                A beautiful, modern design system built with the Flexoki color palette, 
                featuring carefully crafted components for professional applications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group">
                  <Link href="/showcase/core">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/showcase/themes">
                    View Themes
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <div className="w-8 h-8 rounded-full bg-red-light shadow-lg animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-8 h-8 rounded-full bg-orange-light shadow-lg animate-pulse" style={{ animationDelay: '100ms' }} />
              <div className="w-8 h-8 rounded-full bg-yellow-light shadow-lg animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-8 h-8 rounded-full bg-green-light shadow-lg animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-8 h-8 rounded-full bg-cyan-light shadow-lg animate-pulse" style={{ animationDelay: '400ms' }} />
              <div className="w-8 h-8 rounded-full bg-blue-light shadow-lg animate-pulse" style={{ animationDelay: '500ms' }} />
              <div className="w-8 h-8 rounded-full bg-purple-light shadow-lg animate-pulse" style={{ animationDelay: '600ms' }} />
              <div className="w-8 h-8 rounded-full bg-magenta-light shadow-lg animate-pulse" style={{ animationDelay: '700ms' }} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-24 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose FreelancerOS?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with modern best practices and accessibility in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-light/10 flex items-center justify-center mb-4 group-hover:bg-blue-light/20 transition-colors">
                  <Palette className="w-6 h-6 text-blue-light" />
                </div>
                <CardTitle>Beautiful Design</CardTitle>
                <CardDescription>
                  Flexoki color system with carefully crafted light and dark themes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-light/10 flex items-center justify-center mb-4 group-hover:bg-green-light/20 transition-colors">
                  <Zap className="w-6 h-6 text-green-light" />
                </div>
                <CardTitle>High Performance</CardTitle>
                <CardDescription>
                  Optimized components with lazy loading and efficient rendering
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-light/10 flex items-center justify-center mb-4 group-hover:bg-purple-light/20 transition-colors">
                  <Shield className="w-6 h-6 text-purple-light" />
                </div>
                <CardTitle>Accessibility First</CardTitle>
                <CardDescription>
                  WCAG 2.1 AA compliant with full keyboard navigation support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-light/10 flex items-center justify-center mb-4 group-hover:bg-orange-light/20 transition-colors">
                  <Smartphone className="w-6 h-6 text-orange-light" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Responsive design that works perfectly on all device sizes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-light/10 flex items-center justify-center mb-4 group-hover:bg-cyan-light/20 transition-colors">
                  <Code className="w-6 h-6 text-cyan-light" />
                </div>
                <CardTitle>Developer Experience</CardTitle>
                <CardDescription>
                  TypeScript support with excellent IDE integration and documentation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-magenta-light/10 flex items-center justify-center mb-4 group-hover:bg-magenta-light/20 transition-colors">
                  <Eye className="w-6 h-6 text-magenta-light" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Battle-tested components with error boundaries and loading states
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Component Showcase */}
        <section className="container px-4 py-24 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Component Categories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our comprehensive component library
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" asChild>
              <Link href="/showcase/core">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-light mb-2">Core</div>
                  <div className="text-sm text-muted-foreground mb-4">Essential building blocks</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="secondary" className="text-xs">Button</Badge>
                    <Badge variant="secondary" className="text-xs">Card</Badge>
                    <Badge variant="secondary" className="text-xs">Input</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" asChild>
              <Link href="/showcase/navigation">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-light mb-2">Navigation</div>
                  <div className="text-sm text-muted-foreground mb-4">Navigation patterns</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="secondary" className="text-xs">Menu</Badge>
                    <Badge variant="secondary" className="text-xs">Breadcrumb</Badge>
                    <Badge variant="secondary" className="text-xs">Sheet</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" asChild>
              <Link href="/showcase/feedback">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-light mb-2">Feedback</div>
                  <div className="text-sm text-muted-foreground mb-4">User feedback</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="secondary" className="text-xs">Dialog</Badge>
                    <Badge variant="secondary" className="text-xs">Toast</Badge>
                    <Badge variant="secondary" className="text-xs">Alert</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" asChild>
              <Link href="/showcase/advanced">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-light mb-2">Advanced</div>
                  <div className="text-sm text-muted-foreground mb-4">Complex interactions</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="secondary" className="text-xs">Command</Badge>
                    <Badge variant="secondary" className="text-xs">Calendar</Badge>
                    <Badge variant="secondary" className="text-xs">Popover</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </section>

        {/* Status Section */}
        <section className="container px-4 py-24 mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-card/50 backdrop-blur-sm border border-border rounded-full">
            <span className="w-2 h-2 bg-green-light rounded-full animate-pulse" />
            <span className="text-muted-foreground text-sm">System Ready • 50+ Components • Production Ready</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-light to-purple-light rounded" />
              <span className="font-semibold">FreelancerOS Design System</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ for the freelance community
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}