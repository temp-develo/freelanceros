'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  EmptyProposals, 
  EmptyFilteredProposals, 
  EmptySearchResults, 
  FirstProposalGuidance 
} from '@/components/ui/empty-states';

interface ProposalEmptyStateProps {
  type: 'no-proposals' | 'filtered' | 'search' | 'first-time';
  filter?: string;
  searchQuery?: string;
  onClearFilter?: () => void;
  onClearSearch?: () => void;
  className?: string;
}

export function ProposalEmptyState({
  type,
  filter,
  searchQuery = '',
  onClearFilter,
  onClearSearch,
  className
}: ProposalEmptyStateProps) {
  const router = useRouter();
  
  const handleCreateProposal = () => {
    router.push('/proposals/new');
  };
  
  switch (type) {
    case 'no-proposals':
      return (
        <EmptyProposals 
          onCreateProposal={handleCreateProposal}
          className={className}
        />
      );
      
    case 'filtered':
      return (
        <EmptyFilteredProposals 
          filter={filter}
          onClearFilter={onClearFilter}
          className={className}
        />
      );
      
    case 'search':
      return (
        <EmptySearchResults 
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
          className={className}
        />
      );
      
    case 'first-time':
      return (
        <FirstProposalGuidance 
          onCreateProposal={handleCreateProposal}
          className={className}
        />
      );
      
    default:
      return (
        <EmptyProposals 
          onCreateProposal={handleCreateProposal}
          className={className}
        />
      );
  }
}

// Specialized empty state for proposal list
export function ProposalListEmptyState({
  hasFilters,
  searchQuery,
  onClearFilters,
  onClearSearch,
  isFirstTime = false,
  className
}: {
  hasFilters?: boolean;
  searchQuery?: string;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  isFirstTime?: boolean;
  className?: string;
}) {
  if (searchQuery) {
    return (
      <EmptySearchResults
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        className={className}
      />
    );
  }
  
  if (hasFilters) {
    return (
      <EmptyFilteredProposals
        onClearFilter={onClearFilters}
        className={className}
      />
    );
  }
  
  if (isFirstTime) {
    return (
      <FirstProposalGuidance
        className={className}
      />
    );
  }
  
  return (
    <EmptyProposals
      className={className}
    />
  );
}

// Empty state for proposal details page
export function ProposalDetailsEmptyState({
  reason = 'not-found',
  className
}: {
  reason?: 'not-found' | 'no-permission' | 'deleted';
  className?: string;
}) {
  const router = useRouter();
  
  let title = 'Proposal Not Found';
  let description = 'The proposal you are looking for does not exist or has been moved.';
  
  if (reason === 'no-permission') {
    title = 'Access Denied';
    description = 'You do not have permission to view this proposal.';
  } else if (reason === 'deleted') {
    title = 'Proposal Deleted';
    description = 'This proposal has been deleted and is no longer available.';
  }
  
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        
        <Button onClick={() => router.push('/proposals')}>
          Return to Proposals
        </Button>
      </CardContent>
    </Card>
  );
}

// Empty state for proposal creation page
export function ProposalCreationEmptyState({
  className
}: {
  className?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-0">
        <FirstProposalGuidance showCard={false} className={className} />
      </CardContent>
    </Card>
  );
}