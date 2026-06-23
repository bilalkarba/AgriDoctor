// src/app/(app)/about/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/useLocale';
import { Users, Target, Info } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-12">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t('aboutUsTitle')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('aboutUsIntro')}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Target className="mr-3 h-7 w-7 text-primary rtl:ml-3 rtl:mr-0" />
              {t('aboutUsMission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{t('aboutUsMissionText')}</p>
          </CardContent>
        </Card>
       <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
  <Image
    src="https://plus.unsplash.com/premium_photo-1667516707890-48c8681daec5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8JUQ4JUE3JUQ5JTg0JUQ4JUE3JUQ4JUIzJUQ4JUFBJUQ5JTgxJUQ4JUE3JUQ4JUFGJUQ4JUE5JTIwJUQ5JTg1JUQ5JTg2JTIwJUQ4JUE3JUQ5JTg0JUQ4JUIwJUQ5JTgzJUQ4JUE3JUQ4JUExJTIwJUQ4JUE3JUQ5JTg0JUQ4JUE3JUQ4JUI1JUQ4JUI3JUQ5JTg2JUQ4JUE3JUQ4JUI5JUQ5JThBJTIwJUQ5JTg0JUQ4JUFBJUQ5JTg4JUQ5JTgxJUQ5JThBJUQ4JUIxJTIwJUQ4JUFBJUQ4JUI0JUQ4JUFFJUQ5JThBJUQ4JUI1JUQ4JUE3JUQ4JUFBJTIwJUQ4JUFGJUQ5JTgyJUQ5JThBJUQ5JTgyJUQ4JUE5JTIwJUQ5JTg4JUQ4JUIzJUQ5JTg3JUQ5JTg0JUQ4JUE5JTIwJUQ4JUE3JUQ5JTg0JUQ5JTg4JUQ4JUI1JUQ5JTg4JUQ5JTg0JTIwJUQ5JTg0JUQ4JUI1JUQ4JUFEJUQ4JUE5JTIwJUQ4JUE3JUQ5JTg0JUQ5JTg2JUQ4JUE4JUQ4JUE3JUQ4JUFBJUQ4JUE3JUQ4JUFBJUQ4JThDJTIwJUQ5JTg4JUQ4JUFBJUQ4JUI5JUQ4JUIyJUQ5JThBJUQ4JUIyJTIwJUQ4JUE3JUQ5JTg0JUQ4JUIyJUQ4JUIxJUQ4JUE3JUQ4JUI5JUQ4JUE5JTIwJUQ4JUE3JUQ5JTg0JUQ5JTg1JUQ4JUIzJUQ4JUFBJUQ4JUFGJUQ4JUE3JUQ5JTg1JUQ4JUE5JTIwJUQ5JTg4JUQ4JUE3JUQ5JTg0JUQ4JUIwJUQ5JTgzJUQ5JThBfGVufDB8fDB8fHww"
    alt="Our Mission"
    fill
    style={{ objectFit: 'cover' }}
    priority
  />
</div>

      </div>
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
         <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg order-last md:order-first">
            <Image
              src="https://plus.unsplash.com/premium_photo-1665408511212-05e5247fe714?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8JUQ5JTg2JUQ4JUFEJUQ5JTg2JTIwJUQ5JTg1JUQ4JUFDJUQ5JTg1JUQ5JTg4JUQ4JUI5JUQ4JUE5JTIwJUQ4JUI0JUQ4JUJBJUQ5JTg4JUQ5JTgxJUQ4JUE5JTIwJUQ5JTg1JUQ5JTg2JTIwJUQ4JUE3JUQ5JTg0JUQ5JTg1JUQ4JUI3JUQ5JTg4JUQ4JUIxJUQ5JThBJUQ5JTg2JTIwJUQ5JTg4JUQ5JTg1JUQ4JUFEJUQ4JUE4JUQ5JThBJTIwJUQ4JUE3JUQ5JTg0JUQ5JTg2JUQ4JUE4JUQ4JUE3JUQ4JUFBJUQ4JUE3JUQ4JUFBJTIwJUQ5JTg1JUQ5JTg0JUQ4JUFBJUQ4JUIyJUQ5JTg1JUQ5JTg4JUQ5JTg2JTIwJUQ4JUE4JUQ4JUFDJUQ4JUI5JUQ5JTg0JTIwJUQ4JUE3JUQ5JTg0JUQ4JUI5JUQ5JTg2JUQ4JUE3JUQ5JThBJUQ4JUE5JTIwJUQ4JUE4JUQ4JUE3JUQ5JTg0JUQ5JTg2JUQ4JUE4JUQ4JUE3JUQ4JUFBJUQ4JUE3JUQ4JUFBJTIwJUQ4JUEzJUQ4JUIzJUQ5JTg3JUQ5JTg0JTIwJUQ5JTg0JUQ5JTg0JUQ4JUFDJUQ5JTg1JUQ5JThBJUQ4JUI5LnxlbnwwfHwwfHx8MA%3D%3D"
              alt="Diverse team members"
              layout="fill"
              objectFit="cover"
              data-ai-hint="diverse team"
              priority
            />
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-3 h-7 w-7 text-primary rtl:ml-3 rtl:mr-0" />
              {t('aboutUsTeam')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{t('aboutUsTeamText')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg bg-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Info className="mr-3 h-7 w-7 text-primary rtl:ml-3 rtl:mr-0" />
            Project Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 rtl:list-outside rtl:mr-4">
            <li>Provide an intuitive platform for plant health analysis.</li>
            <li>Educate users on plant care and disease prevention.</li>
            <li>Contribute to the adoption of smart farming techniques.</li>
            <li>Foster a community of plant lovers and growers.</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
