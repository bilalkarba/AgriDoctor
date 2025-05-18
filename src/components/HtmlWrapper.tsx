"use client";

import { useLocaleContext } from "@/hooks/useLocale";

export function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleContext();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      {children}
    </html>
  );
}
