'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProposalStatusBadge, ProposalValidity } from './ProposalStatusBadge';
import { ProposalActions } from './ProposalActions';
import { ProposalCard } from './ProposalCard';
import { ProposalTableSkeleton, ProposalListSkeleton } from '@/components/ui/proposal-skeletons';
import { EmptyProposals } from '@/components/ui/empty-states';
import { useProposals } from '@/hooks/useProposals';
import { Proposal, ProposalStatus } from '@/types/proposals';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import {
  Plus,
  Filter,
  Search,
  ArrowUpDown,
  FileText,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';

interface ProposalListProps {
  initialStatus?: ProposalStatus | 'all';
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  className?: string;
}

export function ProposalList({
  initialStatus = 'all',
  limit = 10,
  showHeader = true,
  showFilters = true,
  showPagination = true,
  className
}: ProposalListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set up filters based on active tab and search query
  const filters = {
    status: activeTab !== 'all' ? activeTab as ProposalStatus : undefined,
    search: searchQuery || undefined
  };
  
  // Use the proposals hook
  const {
    proposals,
    loading,
    error,
    totalCount,
    hasMore,
    setFilters,
    pagination,
    setPagination,
    refetch,
    loadMore
  } = useProposals(filters, { page: 1, pageSize: limit });
  
  // Update filters when tab or search changes
  useEffect(() => {
    setFilters({
      status: activeTab !== 'all' ? activeTab as ProposalStatus : undefined,
      search: searchQuery || undefined
    });
  }, [activeTab, searchQuery, setFilters]);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Get proposal counts for tabs
  const getProposalCount = (status: string) => {
    if (status === 'all') return totalCount;
    return proposals.filter(p => p.status === status).length;
  };
  
  // Handle create proposal
  const handleCreateProposal = () => {
    router.push('/proposals/new');
  };
  
  // Handle action complete (refresh data)
  const handleActionComplete = () => {
    refetch();
  };
  
  // Render loading state
  if (loading && proposals.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Proposals</h2>
            <p className="text-muted-foreground">Manage your client proposals</p>
          </div>
        )}
        
        <div className="hidden md:block">
          <ProposalTableSkeleton rows={5} />
        </div>
        
        <div className="md:hidden">
          <ProposalListSkeleton count={3} />
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Proposals</h2>
            <p className="text-muted-foreground">Manage your client proposals</p>
          </div>
        )}
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Proposals</h3>
              <p className="text-muted-foreground mb-4">
                {error.message || 'An unexpected error occurred. Please try again.'}
              </p>
              <Button onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render empty state
  if (proposals.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Proposals</h2>
            <p className="text-muted-foreground">Manage your client proposals</p>
          </div>
        )}
        
        {showFilters && (
          <div className="mb-6">
            <Input
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={handleSearch}
              className="max-w-sm"
              prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            />
          </div>
        )}
        
        {searchQuery ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No proposals found</h3>
                <p className="text-muted-foreground mb-4">
                  No proposals match "{searchQuery}". Try adjusting your search terms.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyProposals onCreateProposal={handleCreateProposal} />
        )}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Proposals</h2>
            <p className="text-muted-foreground">
              Manage your client proposals
            </p>
          </div>
          <Button onClick={handleCreateProposal}>
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </div>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:grid-cols-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All
                  <Badge variant="secondary" className="text-xs">
                    {totalCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="draft" className="flex items-center gap-2">
                  Draft
                  <Badge variant="secondary" className="text-xs">
                    {getProposalCount('draft')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center gap-2">
                  Sent
                  <Badge variant="secondary" className="text-xs">
                    {getProposalCount('sent')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="viewed" className="flex items-center gap-2">
                  Viewed
                  <Badge variant="secondary" className="text-xs">
                    {getProposalCount('viewed')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="flex items-center gap-2">
                  Accepted
                  <Badge variant="secondary" className="text-xs">
                    {getProposalCount('accepted')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  Rejected
                  <Badge variant="secondary" className="text-xs">
                    {getProposalCount('rejected')}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="max-w-xs"
                />
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      )}
      
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                  >
                    Client
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                  >
                    Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow 
                  key={proposal.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/proposals/${proposal.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{proposal.title}</div>
                      {proposal.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {proposal.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${proposal.clientName}`} />
                        <AvatarFallback>
                          {getInitials(proposal.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{proposal.clientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProposalStatusBadge status={proposal.status} />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(proposal.amount, proposal.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(proposal.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ProposalActions 
                      proposal={proposal} 
                      onActionComplete={handleActionComplete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {proposals.map((proposal) => (
          <ProposalCard 
            key={proposal.id} 
            proposal={proposal}
            onActionComplete={handleActionComplete}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {showPagination && hasMore && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      
      {/* Results Summary */}
      {proposals.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground text-center">
          Showing {proposals.length} of {totalCount} proposals
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}