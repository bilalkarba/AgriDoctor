// src/app/(app)/layout.tsx
import type { ReactNode } from 'react';
import { AppLayout } from '@/components/AppLayout';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
