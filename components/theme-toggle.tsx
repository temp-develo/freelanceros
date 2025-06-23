'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 h-9 p-0"
        aria-label="Loading theme toggle"
      >
        <div className="w-4 h-4 animate-pulse bg-muted rounded" />
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleThemeChange = (newTheme: string) => {
    try {
      setTheme(newTheme);
      const themeNames = {
        light: 'Light mode',
        dark: 'Dark mode',
        system: 'System theme'
      };
      toast.success(`Switched to ${themeNames[newTheme as keyof typeof themeNames]}`);
    } catch (error) {
      toast.error('Failed to change theme');
      console.error('Theme change error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Current theme: ${currentTheme}. Click to change theme.`}
        >
          {currentTheme === 'light' ? (
            <Sun className="w-4 h-4 transition-all" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 transition-all" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer"
          aria-label="Switch to light mode"
        >
          <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer"
          aria-label="Switch to dark mode"
        >
          <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer"
          aria-label="Use system theme"
        >
          <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>System</span>
          {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}