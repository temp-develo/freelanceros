'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  Home,
  FileText,
  FolderOpen,
  Users,
  Clock,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Bell,
  Search,
  Plus
} from 'lucide-react'

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: string
  active?: boolean
}

interface SidebarProps {
  className?: string
  items?: SidebarItem[]
}

const defaultSidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Proposals', href: '/proposals', badge: '3' },
  { icon: FolderOpen, label: 'Projects', href: '/projects', badge: '8' },
  { icon: Users, label: 'Client Portals', href: '/clients' },
  { icon: Clock, label: 'Time Tracking', href: '/time-tracking' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar({ className, items = defaultSidebarItems }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Update active state based on current pathname
  const sidebarItems = items.map(item => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + '/')
  }))

  const handleSignOut = async () => {
    await signOut()
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b transition-all duration-300",
        isCollapsed && !isMobile ? "p-4 justify-center" : "space-x-2 p-6"
      )}>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg flex-shrink-0" />
        {(!isCollapsed || isMobile) && (
          <span className="font-bold text-xl">FreelancerOS</span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 space-y-2 transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "transition-all duration-300",
              isCollapsed && !isMobile 
                ? "w-10 h-10 p-0 justify-center" 
                : "w-full justify-start"
            )}
            onClick={() => handleNavigation(item.href)}
            title={isCollapsed && !isMobile ? item.label : undefined}
          >
            <item.icon className={cn(
              "flex-shrink-0",
              isCollapsed && !isMobile ? "w-4 h-4" : "w-4 h-4 mr-3"
            )} />
            {(!isCollapsed || isMobile) && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn(
              "transition-all duration-300",
              isCollapsed ? "w-10 h-10 p-0 justify-center mx-auto" : "w-full justify-start"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* User Profile Section */}
      <div className={cn(
        "border-t transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex items-center rounded-lg bg-muted/50 transition-all duration-300",
          isCollapsed && !isMobile 
            ? "p-2 justify-center" 
            : "space-x-3 p-3"
        )}>
          <Avatar className={cn(
            "flex-shrink-0",
            isCollapsed && !isMobile ? "w-8 h-8" : "w-8 h-8"
          )}>
            <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
            <AvatarFallback>
              {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        
        {(!isCollapsed || isMobile) && (
          <div className="mt-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => router.push('/profile')}
            >
              <User className="w-3 h-3 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-30",
        isCollapsed ? "lg:w-16" : "lg:w-80",
        className
      )}>
        <div className="flex flex-col flex-1 border-r bg-card">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

interface MobileSidebarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  items?: SidebarItem[]
}

export function MobileSidebar({ isOpen, onOpenChange, items = defaultSidebarItems }: MobileSidebarProps) {
  const SidebarContent = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { user, signOut } = useAuth()

    // Update active state based on current pathname
    const sidebarItems = items.map(item => ({
      ...item,
      active: pathname === item.href || pathname.startsWith(item.href + '/')
    }))

    const handleSignOut = async () => {
      await signOut()
    }

    const handleNavigation = (href: string) => {
      router.push(href)
      onOpenChange(false) // Close mobile sidebar after navigation
    }

    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-2 p-6 border-b">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg" />
          <span className="font-bold text-xl">FreelancerOS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
              <AvatarFallback>
                {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                router.push('/profile')
                onOpenChange(false)
              }}
            >
              <User className="w-3 h-3 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-80">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}

interface SidebarTriggerProps {
  onClick: () => void
  className?: string
}

export function SidebarTrigger({ onClick, className }: SidebarTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("lg:hidden", className)}
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
      <span className="sr-only">Open sidebar</span>
    </Button>
  )
}