# FreelancerOS Design System

A beautiful, modern design system built with Next.js, shadcn/ui, and the Flexoki color palette. This comprehensive component library provides everything needed for professional freelance management applications.

## 🎨 Features

- **Complete Component Library**: 50+ production-ready components
- **Flexoki Color System**: Beautiful, accessible color palette with light/dark themes
- **Theme Support**: Seamless light/dark mode switching with system detection
- **Accessibility First**: WCAG 2.1 AA compliant with full keyboard navigation
- **TypeScript**: Fully typed components with excellent developer experience
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Performance Optimized**: Lazy loading, skeleton states, and error boundaries

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd freelanceros-design-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage

```tsx
import { Button, Card, CardContent } from '@/lib/components';

export function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button variant="primary">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

## 📦 Component Categories

### Core Components
- **Button**: Primary, secondary, destructive, ghost, and outline variants
- **Card**: Flexible container with header, content, and footer sections
- **Input**: Form inputs with validation states and accessibility
- **Label**: Accessible form labels with proper associations
- **Badge**: Status indicators and tags
- **Avatar**: User profile images with fallbacks

### Navigation Components
- **NavigationMenu**: Horizontal navigation with dropdown support
- **Breadcrumb**: Hierarchical navigation trails
- **Sheet**: Mobile-friendly slide-out navigation
- **Separator**: Visual content dividers

### Feedback Components
- **Dialog**: Modal dialogs for forms and confirmations
- **AlertDialog**: Confirmation dialogs for destructive actions
- **Alert**: Status messages and notifications
- **Toast**: Temporary notifications with auto-dismiss
- **Progress**: Loading and completion indicators

### Advanced Components
- **Popover**: Contextual overlays for forms and settings
- **DropdownMenu**: Action menus with icons and separators
- **Command**: Search palette for quick navigation
- **Calendar**: Date selection with keyboard navigation
- **Tabs**: Tabbed interfaces for content organization

### Data Components
- **Table**: Sortable data tables with responsive design
- **Accordion**: Collapsible content sections
- **Skeleton**: Loading placeholders for better UX

## 🎨 Theme System

### Theme Configuration

The design system uses next-themes for seamless theme switching:

```tsx
import { ThemeProvider } from 'next-themes';

export function App({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
```

### Using Theme Toggle

```tsx
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Flexoki Color Palette

The design system uses the complete Flexoki color palette:

#### Accent Colors
- Red: `#af3029` (light) / `#d14d41` (dark)
- Orange: `#bc5215` (light) / `#da702c` (dark)
- Yellow: `#ad8301` (light) / `#d0a215` (dark)
- Green: `#66800b` (light) / `#879a39` (dark)
- Cyan: `#24837b` (light) / `#3aa99f` (dark)
- Blue: `#205ea6` (light) / `#4385be` (dark)
- Purple: `#5e409d` (light) / `#8b7ec8` (dark)
- Magenta: `#a02f6f` (light) / `#ce5d97` (dark)

#### Base Colors
- Complete grayscale from `base-black` to `base-paper`
- Semantic color mappings for consistent theming

## ♿ Accessibility

### Keyboard Navigation
- Full keyboard support for all interactive components
- Proper focus management and visible focus indicators
- Tab order follows logical content flow

### Screen Reader Support
- Comprehensive ARIA labels and descriptions
- Semantic HTML structure
- Live regions for dynamic content updates

### Color Contrast
- WCAG 2.1 AA compliant contrast ratios
- High contrast mode support
- Color-blind friendly palette

## 🔧 Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── showcase/          # Component demonstrations
├── components/
│   ├── ui/               # shadcn/ui components
│   └── theme-toggle.tsx  # Theme switching component
├── lib/
│   ├── components/       # Component exports
│   ├── utils.ts         # Utility functions
│   └── error-boundary.tsx # Error handling
└── hooks/               # Custom React hooks
```

### Adding New Components

1. Create the component in `components/ui/`
2. Add proper TypeScript types
3. Include accessibility attributes
4. Add to component exports in `lib/components/`
5. Create showcase page for documentation

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the established spacing system (8px grid)
- Maintain consistent border radius (`var(--radius)`)
- Use CSS variables for theme-aware colors

## 🧪 Testing

### Component Testing
```bash
# Run component tests
npm run test

# Run accessibility tests
npm run test:a11y
```

### Manual Testing Checklist
- [ ] Keyboard navigation works in all components
- [ ] Screen reader announces content correctly
- [ ] Theme switching works smoothly
- [ ] Components work on mobile devices
- [ ] Loading states display properly
- [ ] Error boundaries catch and display errors

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## 🚀 Performance

### Optimization Features
- Lazy loading for heavy components
- Skeleton screens for better perceived performance
- Optimized bundle splitting
- Efficient re-rendering with React.memo

### Bundle Size
- Core components: ~50KB gzipped
- Full library: ~150KB gzipped
- Tree-shakeable exports for minimal bundles

## 🔌 Integration

### Using in Other Projects

1. Copy the `lib/components/` directory to your project
2. Install required dependencies:
   ```bash
   npm install @radix-ui/react-* lucide-react next-themes
   ```
3. Configure Tailwind CSS with the provided config
4. Import and use components as needed

### Component Exports

```tsx
// Import individual components
import { Button, Card, Input } from '@/lib/components';

// Import component groups
import { 
  NavigationComponents,
  FeedbackComponents,
  DataComponents 
} from '@/lib/components';
```

## 📚 Documentation

### Live Examples
Visit `/showcase` routes to see all components in action:
- `/showcase/core` - Core components
- `/showcase/navigation` - Navigation components
- `/showcase/feedback` - Feedback components
- `/showcase/advanced` - Advanced components
- `/showcase/data` - Data components
- `/showcase/themes` - Theme system

### API Documentation
Each component includes comprehensive TypeScript types and JSDoc comments for excellent IDE support.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the style guide
4. Add tests and documentation
5. Submit a pull request

### Code Style
- Use TypeScript for all components
- Follow the established naming conventions
- Include proper accessibility attributes
- Add comprehensive error handling

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component foundation
- [Flexoki](https://stephango.com/flexoki) for the beautiful color palette
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

Built with ❤️ for the freelance community