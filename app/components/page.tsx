'use client';

import { Button } from '@/components/ui/button';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Component Showcase
          </h1>
          <p className="text-base-500 text-lg">
            Testing shadcn/ui components with Flexoki color system
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-base-200">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">
                Default Button
              </Button>
              
              <Button variant="secondary">
                Secondary Button
              </Button>
              
              <Button variant="destructive">
                Destructive Button
              </Button>
              
              <Button variant="outline">
                Outline Button
              </Button>
              
              <Button variant="ghost">
                Ghost Button
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-base-200">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-base-200">Interactive States</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Hover me</Button>
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>

          <div className="mt-12 p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-medium text-card-foreground mb-4">
              Color System Test
            </h3>
            <p className="text-muted-foreground mb-4">
              These buttons use the Flexoki color system mapped to shadcn/ui CSS variables.
              The primary color uses Flexoki blue-light in dark mode, with proper contrast ratios.
            </p>
            <div className="flex gap-2">
              <Button>Primary (Blue Light)</Button>
              <Button variant="secondary">Secondary (Base-900)</Button>
              <Button variant="destructive">Destructive (Red Light)</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}