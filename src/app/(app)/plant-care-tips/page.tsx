// src/app/(app)/plant-care-tips/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/useLocale';
import { Leaf } from 'lucide-react';

export default function PlantCareTipsPage() {
  const { t } = useLocale();

  const tips = [
    { titleKey: 'tip1Title', contentKey: 'tip1Content' },
    { titleKey: 'tip2Title', contentKey: 'tip2Content' },
    { titleKey: 'tip3Title', contentKey: 'tip3Content' },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t('plantCareTipsTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('plantCareTipsIntro')}</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Leaf className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                {t(tip.titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t(tip.contentKey)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
