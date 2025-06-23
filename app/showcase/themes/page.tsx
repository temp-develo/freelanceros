'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Eye, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const flexokiColors = [
  { name: 'Red', light: '#af3029', dark: '#d14d41', css: 'red' },
  { name: 'Orange', light: '#bc5215', dark: '#da702c', css: 'orange' },
  { name: 'Yellow', light: '#ad8301', dark: '#d0a215', css: 'yellow' },
  { name: 'Green', light: '#66800b', dark: '#879a39', css: 'green' },
  { name: 'Cyan', light: '#24837b', dark: '#3aa99f', css: 'cyan' },
  { name: 'Blue', light: '#205ea6', dark: '#4385be', css: 'blue' },
  { name: 'Purple', light: '#5e409d', dark: '#8b7ec8', css: 'purple' },
  { name: 'Magenta', light: '#a02f6f', dark: '#ce5d97', css: 'magenta' },
];

const baseColors = [
  { name: 'Base Black', value: '#100f0f', css: 'base-black' },
  { name: 'Base 950', value: '#1c1b1a', css: 'base-950' },
  { name: 'Base 900', value: '#282726', css: 'base-900' },
  { name: 'Base 850', value: '#343331', css: 'base-850' },
  { name: 'Base 800', value: '#403e3c', css: 'base-800' },
  { name: 'Base 700', value: '#575653', css: 'base-700' },
  { name: 'Base 600', value: '#6f6e69', css: 'base-600' },
  { name: 'Base 500', value: '#878580', css: 'base-500' },
  { name: 'Base 300', value: '#b7b5ac', css: 'base-300' },
  { name: 'Base 200', value: '#cecdc3', css: 'base-200' },
  { name: 'Base 150', value: '#dad8ce', css: 'base-150' },
  { name: 'Base 100', value: '#e6e4d9', css: 'base-100' },
  { name: 'Base 50', value: '#f2f0e5', css: 'base-50' },
  { name: 'Base Paper', value: '#fffcf0', css: 'base-paper' },
];

export default function ThemesShowcasePage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading themes...</div>
      </div>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="min-h-screen">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-light to-purple-light rounded-lg"></div>
            <span className="font-bold text-xl">FreelancerOS</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Current: {currentTheme === 'dark' ? 'Dark' : 'Light'} Mode
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Theme System Showcase
          </h1>
          <p className="text-base-500 text-lg max-w-2xl mx-auto">
            Comprehensive theme support with smooth transitions between light and dark modes using the Flexoki color system
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Theme Controls */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Theme Controls</h2>
            <p className="text-muted-foreground">
              Switch between light, dark, and system themes to see the design system adapt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6 text-center" onClick={() => setTheme('light')}>
                <Sun className="w-8 h-8 mx-auto mb-2 text-yellow" />
                <h3 className="font-medium">Light Mode</h3>
                <p className="text-sm text-muted-foreground">Clean and bright interface</p>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6 text-center" onClick={() => setTheme('dark')}>
                <Moon className="w-8 h-8 mx-auto mb-2 text-blue-light" />
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Easy on the eyes</p>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6 text-center" onClick={() => setTheme('system')}>
                <Monitor className="w-8 h-8 mx-auto mb-2 text-purple-light" />
                <h3 className="font-medium">System</h3>
                <p className="text-sm text-muted-foreground">Follow system preference</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Color Palette */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground flex items-center">
              <Palette className="w-6 h-6 mr-2 text-primary" />
              Flexoki Color Palette
            </h2>
            <p className="text-muted-foreground">
              The complete Flexoki color system with light and dark variants
            </p>
          </div>

          {/* Accent Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Accent Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {flexokiColors.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div 
                    className="h-20 w-full"
                    style={{ backgroundColor: currentTheme === 'dark' ? color.dark : color.light }}
                  />
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{color.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {currentTheme === 'dark' ? color.dark : color.light}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {color.css}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Base Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Base Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {baseColors.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div 
                    className="h-16 w-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  <CardContent className="p-2">
                    <h4 className="font-medium text-xs">{color.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {color.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Component Examples */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground flex items-center">
              <Eye className="w-6 h-6 mr-2 text-primary" />
              Component Examples
            </h2>
            <p className="text-muted-foreground">
              See how components adapt to different themes with smooth transitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="transition-theme">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Sarah Chen</CardTitle>
                    <CardDescription>Product Designer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">sarah@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex space-x-2">
                  <Badge>Designer</Badge>
                  <Badge variant="secondary">Remote</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Form Card */}
            <Card className="transition-theme">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings Form
                </CardTitle>
                <CardDescription>Example form with theme-aware styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" placeholder="Enter project name..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="transition-theme">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Visual progress indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Development</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="transition-theme" />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    -10%
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    +10%
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Alert Examples */}
        <section className="space-y-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Alert Components</h2>
            <p className="text-muted-foreground">
              Alert components with theme-aware styling and smooth transitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Alert className="transition-theme">
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This alert adapts to the current theme automatically.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-light/20 bg-green-light/5 transition-theme">
                <CheckCircle className="h-4 w-4 text-green-light" />
                <AlertTitle className="text-green-light">Success</AlertTitle>
                <AlertDescription>
                  Theme switching completed successfully with smooth transitions.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <Alert className="border-orange-light/20 bg-orange-light/5 transition-theme">
                <AlertTriangle className="h-4 w-4 text-orange-light" />
                <AlertTitle className="text-orange-light">Warning</AlertTitle>
                <AlertDescription>
                  Colors maintain proper contrast ratios in both themes.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive" className="transition-theme">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Destructive alerts use theme-appropriate red variants.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Theme Features */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Theme Features</h2>
            <p className="text-muted-foreground">
              Advanced theming capabilities and implementation details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="transition-theme">
              <CardContent className="p-6 text-center">
                <Sun className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Smooth Transitions</h3>
                <p className="text-sm text-muted-foreground">
                  All components transition smoothly between themes
                </p>
              </CardContent>
            </Card>

            <Card className="transition-theme">
              <CardContent className="p-6 text-center">
                <Palette className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Flexoki Colors</h3>
                <p className="text-sm text-muted-foreground">
                  Complete Flexoki palette with light/dark variants
                </p>
              </CardContent>
            </Card>

            <Card className="transition-theme">
              <CardContent className="p-6 text-center">
                <Monitor className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">System Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically follows system theme preferences
                </p>
              </CardContent>
            </Card>

            <Card className="transition-theme">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Maintains proper contrast ratios in all themes
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-card/50 to-muted/20 border-border transition-theme">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Complete Theme System
              </CardTitle>
              <CardDescription className="text-base">
                Professional theming with next-themes and Flexoki color system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">16</div>
                  <div className="text-sm text-muted-foreground">Flexoki Colors</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Theme Modes</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Smooth Transitions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}