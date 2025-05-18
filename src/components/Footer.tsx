// src/components/Footer.tsx
"use client";

import { useLocale } from '@/hooks/useLocale';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {t('footerText')}
          </p>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
