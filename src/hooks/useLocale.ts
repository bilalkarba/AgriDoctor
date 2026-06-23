// src/hooks/useLocale.ts
"use client";

import { useLocaleContext } from '@/providers/LocaleProvider';
import { getTranslation, type TranslationKeys } from '@/translations';

export const useLocale = () => {
  const { locale, setLocale } = useLocaleContext();

  const t = (key: TranslationKeys) => {
    return getTranslation(locale, key);
  };

  return { locale, setLocale, t };
};

export { useLocaleContext };
