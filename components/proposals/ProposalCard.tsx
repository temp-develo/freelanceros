'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProposalStatusBadge, ProposalValidity } from './ProposalStatusBadge';
import { ProposalActions } from './ProposalActions';
import { Proposal } from '@/types/proposals';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { Calendar, Clock, DollarSign, ExternalLink } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  onActionComplete?: () => void;
  className?: string;
}

export function ProposalCard({ proposal, onActionComplete, className }: ProposalCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/proposals/${proposal.id}`);
  };
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-medium line-clamp-1">{proposal.title}</h3>
            {proposal.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {proposal.description}
              </p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ProposalActions proposal={proposal} onActionComplete={onActionComplete} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${proposal.clientName}`} />
            <AvatarFallback>
              {getInitials(proposal.clientName)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{proposal.clientName}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <ProposalStatusBadge status={proposal.status} />
          <span className="font-semibold text-lg">
            {formatCurrency(proposal.amount, proposal.currency)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(proposal.createdAt)}</span>
          </div>
          {proposal.validUntil && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <ProposalValidity validUntil={proposal.validUntil} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProposalCardCompactProps {
  proposal: Proposal;
  onClick?: () => void;
  className?: string;
}

export function ProposalCardCompact({ proposal, onClick, className }: ProposalCardCompactProps) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-sm transition-shadow ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProposalStatusBadge status={proposal.status} size="sm" />
          <div>
            <h4 className="font-medium text-sm">{proposal.title}</h4>
            <p className="text-xs text-muted-foreground">{proposal.clientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatCurrency(proposal.amount, proposal.currency)}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}