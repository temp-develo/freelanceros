import { cn } from '@/lib/utils'
import { Check, Cloud, CloudOff, Loader2, Save, Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean
  lastAutoSaved: Date | null
  isDirty: boolean
  className?: string
}

export function AutoSaveIndicator({ 
  isAutoSaving, 
  lastAutoSaved, 
  isDirty,
  className 
}: AutoSaveIndicatorProps) {
  const getStatus = () => {
    if (isAutoSaving) {
      return {
        icon: Loader2,
        text: 'Saving...',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        iconClass: 'animate-spin'
      }
    }

    if (!isDirty && lastAutoSaved) {
      return {
        icon: Check,
        text: 'Saved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        iconClass: ''
      }
    }

    if (isDirty) {
      return {
        icon: Cloud,
        text: 'Unsaved changes',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        iconClass: ''
      }
    }

    return {
      icon: CloudOff,
      text: 'Not saved',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      iconClass: ''
    }
  }

  const status = getStatus()
  const Icon = status.icon

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge className={`${status.color} border-0 font-medium`}>
        <Icon className={cn("w-3 h-3 mr-1", status.iconClass)} />
        {status.text}
      </Badge>
      
      {lastAutoSaved && !isAutoSaving && (
        <span className="text-xs text-muted-foreground">
          Last saved {formatLastSaved(lastAutoSaved)}
        </span>
      )}
    </div>
  )
}

interface ConnectionStatusProps {
  isOnline: boolean
  className?: string
}

export function ConnectionStatus({ isOnline, className }: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-600">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-600" />
          <span className="text-xs text-red-600">Offline</span>
        </>
      )}
    </div>
  )
}