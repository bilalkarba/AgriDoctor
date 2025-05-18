// src/translations/index.ts
import type { Locale } from '@/providers/LocaleProvider';
import enTranslations from './en';
import arTranslations from './ar';

export type TranslationKeys = keyof typeof enTranslations;

const translationsData = {
  en: enTranslations,
  ar: arTranslations,
};

export const getTranslation = (locale: Locale, key: TranslationKeys): string => {
  const dict = translationsData[locale] || translationsData.en; // Fallback to English
  return dict[key] || key; // Fallback to key itself if not found
};
