'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Edit, 
  Send, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ProposalStatus } from '@/types/proposals';

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export function ProposalStatusBadge({ 
  status, 
  className,
  showIcon = true,
  size = 'default'
}: ProposalStatusBadgeProps) {
  // Define status configurations
  const statusConfig = {
    draft: {
      label: 'Draft',
      icon: Edit,
      variant: 'outline',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700'
    },
    sent: {
      label: 'Sent',
      icon: Send,
      variant: 'default',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700'
    },
    viewed: {
      label: 'Viewed',
      icon: Eye,
      variant: 'default',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700'
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle,
      variant: 'default',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700'
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      variant: 'default',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700'
    },
    expired: {
      label: 'Expired',
      icon: Clock,
      variant: 'default',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-700'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0 px-2',
    default: 'text-xs py-1 px-2.5',
    lg: 'text-sm py-1 px-3'
  };

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

// Component to show proposal validity status
interface ProposalValidityProps {
  validUntil: string | null;
  className?: string;
}

export function ProposalValidity({ validUntil, className }: ProposalValidityProps) {
  if (!validUntil) return null;
  
  const validDate = new Date(validUntil);
  const now = new Date();
  const isExpired = validDate < now;
  
  // Calculate days remaining
  const daysRemaining = Math.ceil((validDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isAlmostExpired = daysRemaining <= 7 && daysRemaining > 0;
  
  if (isExpired) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700",
          className
        )}
      >
        <Clock className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }
  
  if (isAlmostExpired) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-700",
          className
        )}
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700",
        className
      )}
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      Valid until {validDate.toLocaleDateString()}
    </Badge>
  );
}