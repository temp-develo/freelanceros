// Core Components
export { Button } from '@/components/ui/button';
export type { ButtonProps } from '@/components/ui/button';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export { Input } from '@/components/ui/input';
export type { InputProps } from '@/components/ui/input';

export { Label } from '@/components/ui/label';

export { Badge } from '@/components/ui/badge';
export type { BadgeProps } from '@/components/ui/badge';

export { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation Components
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export { Separator } from '@/components/ui/separator';

// Feedback Components
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export { Progress } from '@/components/ui/progress';

export { Toaster } from '@/components/ui/sonner';
export { toast } from 'sonner';

// Advanced Components
export {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export { Calendar } from '@/components/ui/calendar';

// Data Components
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export { Skeleton, CardSkeleton, TableSkeleton, ListSkeleton, FormSkeleton } from '@/components/ui/loading-skeleton';

// Theme Components
export { ThemeToggle } from '@/components/theme-toggle';

// Error Handling
export { ErrorBoundary, useErrorBoundary, withErrorBoundary } from '@/lib/error-boundary';

// Hooks
export { useLoading, useMultipleLoading } from '@/hooks/use-loading';

// Utilities
export { cn } from '@/lib/utils';
export * from '@/lib/accessibility';

// Component Groups for Easy Import
export const CoreComponents = {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
};

export const NavigationComponents = {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Separator,
};

export const FeedbackComponents = {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  Toaster,
  toast,
};

export const AdvancedComponents = {
  Popover,
  PopoverContent,
  PopoverTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Calendar,
};

export const DataComponents = {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  FormSkeleton,
};

// Re-export everything from shadcn/ui components
export * from '@/components/ui/button';
export * from '@/components/ui/card';
export * from '@/components/ui/input';
export * from '@/components/ui/label';
export * from '@/components/ui/badge';
export * from '@/components/ui/avatar';
export * from '@/components/ui/navigation-menu';
export * from '@/components/ui/breadcrumb';
export * from '@/components/ui/sheet';
export * from '@/components/ui/separator';
export * from '@/components/ui/dialog';
export * from '@/components/ui/alert-dialog';
export * from '@/components/ui/alert';
export * from '@/components/ui/progress';
export * from '@/components/ui/popover';
export * from '@/components/ui/dropdown-menu';
export * from '@/components/ui/command';
export * from '@/components/ui/calendar';
export * from '@/components/ui/table';
export * from '@/components/ui/accordion';
export * from '@/components/ui/tabs';