'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProposalStatusBadge } from '@/components/proposals/ProposalStatusBadge'
import { ProposalActions } from '@/components/proposals/ProposalActions'
import { ProposalTableSkeleton, ProposalListSkeleton } from '@/components/ui/proposal-skeletons'
import { ProposalEmptyState } from '@/components/proposals/EmptyProposalStates'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import {
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Trash2,
  Download,
  Copy,
  Calendar,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  FileText,
  Search
} from 'lucide-react'

export default function ProposalsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Set up filters based on active tab and search query
  const filters = {
    status: activeTab !== 'all' ? activeTab as any : undefined,
    search: searchQuery || undefined
  }
  
  // Use the proposals hook
  const {
    proposals,
    loading,
    error,
    totalCount,
    hasMore,
    setFilters,
    refetch,
    loadMore
  } = useProposals(filters)

  // Update filters when tab or search changes
  useEffect(() => {
    setFilters({
      status: activeTab !== 'all' ? activeTab as any : undefined,
      search: searchQuery || undefined
    })
  }, [activeTab, searchQuery, setFilters])

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Clear filters
  const handleClearFilters = () => {
    setActiveTab('all')
  }

  // Get proposal counts for tabs
  const getProposalCount = (status: string) => {
    if (status === 'all') return totalCount
    return proposals.filter(p => p.status === status).length
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // Determine which empty state to show
  const getEmptyStateType = () => {
    if (searchQuery) {
      return 'search'
    }
    
    if (activeTab !== 'all') {
      return 'filtered'
    }
    
    // Check if this is the user's first time (no proposals at all)
    // In a real app, you might check a user preference or onboarding flag
    const isFirstTime = totalCount === 0
    
    return isFirstTime ? 'first-time' : 'no-proposals'
  }

  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your project proposals and track their status
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={() => router.push('/proposals/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Proposal
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <Badge variant="secondary" className="text-xs">
                  {getProposalCount('all')}
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
          </Tabs>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search proposals..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && proposals.length === 0 && (
            <>
              <div className="hidden md:block">
                <ProposalTableSkeleton rows={5} />
              </div>
              <div className="md:hidden">
                <ProposalListSkeleton count={3} />
              </div>
            </>
          )}

          {/* Error State */}
          {error && (
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
          )}

          {/* Empty States */}
          {!loading && !error && proposals.length === 0 && (
            <ProposalEmptyState
              type={getEmptyStateType()}
              filter={activeTab !== 'all' ? activeTab : undefined}
              searchQuery={searchQuery}
              onClearFilter={handleClearFilters}
              onClearSearch={handleClearSearch}
            />
          )}

          {/* Desktop Table View */}
          {!loading && !error && proposals.length > 0 && (
            <div className="hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 font-medium"
                          onClick={() => handleSort('title')}
                        >
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 font-medium"
                          onClick={() => handleSort('client')}
                        >
                          Client
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 font-medium"
                          onClick={() => handleSort('status')}
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 font-medium"
                          onClick={() => handleSort('value')}
                        >
                          Value
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 font-medium"
                          onClick={() => handleSort('createdDate')}
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
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {proposal.description}
                            </div>
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
                            onActionComplete={refetch}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && !error && proposals.length > 0 && (
            <div className="md:hidden space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-3 pb-3">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{proposal.title}</h3>
                          {proposal.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {proposal.description}
                            </p>
                          )}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <ProposalActions proposal={proposal} onActionComplete={refetch} />
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
                      
                      <div className="flex justify-between items-center">
                        <ProposalStatusBadge status={proposal.status} />
                        <span className="font-semibold text-lg">
                          {formatCurrency(proposal.amount, proposal.currency)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm pt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(proposal.createdAt)}</span>
                        </div>
                        {proposal.validUntil && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>Valid until {formatDate(proposal.validUntil)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && proposals.length > 0 && hasMore && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && proposals.length > 0 && (
            <div className="mt-6 text-sm text-muted-foreground text-center">
              Showing {proposals.length} of {totalCount} proposals
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}