// src/components/LanguageToggle.tsx
"use client";

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  const toggle = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>
      <Languages className="h-5 w-5" />
      <span className="ml-2">{t('toggleLanguage')}</span>
    </Button>
  );
}
