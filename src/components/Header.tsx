// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { LeafIcon } from '@/components/Icon';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", labelKey: "navHome" },
    { href: "/plant-care-tips", labelKey: "navPlantCareTips" },
    { href: "/about", labelKey: "navAboutUs" },
    { href: "/contact", labelKey: "navContactUs" },
  ] as const; // Add 'as const' for type safety with TranslationKeys

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <LeafIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">{t('appName')}</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg p-4 border-t border-border/40">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary py-2",
                  pathname === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
