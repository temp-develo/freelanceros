'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Home, Users, Settings, FileText, BarChart3, HelpCircle, ChevronDown, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FileText,
    children: [
      { title: 'All Projects', href: '/projects', description: 'View all your projects' },
      { title: 'Active Projects', href: '/projects/active', description: 'Currently active projects' },
      { title: 'Completed', href: '/projects/completed', description: 'Finished projects' },
      { title: 'Templates', href: '/projects/templates', description: 'Project templates' },
    ],
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
    children: [
      { title: 'All Clients', href: '/clients', description: 'Manage your clients' },
      { title: 'Active Clients', href: '/clients/active', description: 'Currently active clients' },
      { title: 'Client Reports', href: '/clients/reports', description: 'Client performance reports' },
    ],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { title: 'Overview', href: '/analytics', description: 'Analytics overview' },
      { title: 'Revenue', href: '/analytics/revenue', description: 'Revenue analytics' },
      { title: 'Time Tracking', href: '/analytics/time', description: 'Time tracking reports' },
      { title: 'Performance', href: '/analytics/performance', description: 'Performance metrics' },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function NavigationShowcasePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg"></div>
            <span className="font-bold text-xl">FreelancerOS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent">
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">{child.title}</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-light to-purple-light rounded"></div>
                    <span>FreelancerOS</span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through your freelance workspace
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                      {item.children && (
                        <div className="ml-8 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="w-4 h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/showcase">Showcase</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Navigation Components</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Navigation Components Showcase
          </h1>
          <p className="text-base-500 text-lg max-w-2xl mx-auto">
            Comprehensive navigation patterns including horizontal menus, breadcrumbs, mobile sheets, and separators
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Navigation Menu Section */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Horizontal Navigation Menu</h2>
            <p className="text-muted-foreground">
              The navigation menu above demonstrates horizontal navigation with dropdown submenus. 
              Hover over "Projects", "Clients", or "Analytics" to see the dropdown content.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Navigation Features</CardTitle>
              <CardDescription>Key features of the navigation menu component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2 text-blue-light" />
                    Dropdown Menus
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-level navigation with descriptive submenus
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Menu className="w-4 h-4 mr-2 text-green-light" />
                    Mobile Responsive
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically switches to mobile sheet on smaller screens
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-purple-light" />
                    Keyboard Navigation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Full keyboard accessibility support
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2 text-orange-light" />
                    Contextual Content
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Rich dropdown content with descriptions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-12" />

        {/* Breadcrumb Section */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Breadcrumb Navigation</h2>
            <p className="text-muted-foreground">
              Breadcrumbs help users understand their current location and navigate back to parent pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simple Breadcrumb</CardTitle>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Website Redesign</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complex Breadcrumb</CardTitle>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Home className="w-4 h-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/clients/acme-corp">Acme Corp</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Project Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Mobile Sheet Section */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Mobile Sheet Navigation</h2>
            <p className="text-muted-foreground">
              On mobile devices, the navigation automatically switches to a slide-out sheet menu. 
              Try resizing your browser or check the hamburger menu in the header.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sheet Demo</CardTitle>
                <CardDescription>Try the mobile navigation sheet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Menu className="w-4 h-4 mr-2" />
                      Open Navigation Sheet
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Navigation Menu</SheetTitle>
                      <SheetDescription>
                        This is how the mobile navigation looks
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {navigationItems.slice(0, 3).map((item) => (
                        <div key={item.title} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Touch Friendly</Badge>
                    <span className="text-sm">Optimized for touch interactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Slide Animation</Badge>
                    <span className="text-sm">Smooth slide-in/out animations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Backdrop Blur</Badge>
                    <span className="text-sm">Modern backdrop blur effect</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Auto Close</Badge>
                    <span className="text-sm">Closes automatically on navigation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Separator Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-base-200">Separator Component</h2>
            <p className="text-muted-foreground">
              Separators help organize content and create visual breaks between sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horizontal Separators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>Section 1 Content</div>
                <Separator />
                <div>Section 2 Content</div>
                <Separator />
                <div>Section 3 Content</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vertical Separators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 h-20">
                  <div className="flex-1 text-center">Left Content</div>
                  <Separator orientation="vertical" />
                  <div className="flex-1 text-center">Middle Content</div>
                  <Separator orientation="vertical" />
                  <div className="flex-1 text-center">Right Content</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-base-950/50 to-base-900/50 border-base-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Navigation Components Summary
              </CardTitle>
              <CardDescription className="text-base">
                Complete navigation system for modern web applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-light">Menu</div>
                  <div className="text-sm text-muted-foreground">Horizontal navigation</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-light">Breadcrumb</div>
                  <div className="text-sm text-muted-foreground">Location tracking</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-light">Sheet</div>
                  <div className="text-sm text-muted-foreground">Mobile navigation</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-light">Separator</div>
                  <div className="text-sm text-muted-foreground">Content organization</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}