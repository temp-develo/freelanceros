'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sidebar, MobileSidebar, SidebarTrigger, SidebarItem } from './Sidebar'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Plus
} from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  sidebarItems?: SidebarItem[]
  headerActions?: React.ReactNode
  className?: string
}

export function AppLayout({ 
  children, 
  sidebarItems, 
  headerActions,
  className 
}: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onOpenChange={setMobileSidebarOpen}
        items={sidebarItems}
      />

      {/* Desktop Sidebar */}
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="lg:pl-80 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <SidebarTrigger onClick={() => setMobileSidebarOpen(true)} />

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center max-w-md">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search projects, clients, tasks..."
                type="search"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Custom header actions */}
            {headerActions}

            {/* Default actions */}
            <Button size="sm" className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-light text-xs text-white flex items-center justify-center">
                2
              </span>
              <span className="sr-only">View notifications</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
                    <AvatarFallback>
                      {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}