
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { Toaster } from "@/components/ui/toaster";
import { HtmlWrapper } from '@/components/HtmlWrapper'; // Import the new client component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Verdant Eye',
  description: 'Analyze plant health with AI',
  icons: null, // This line ensures no favicon tags are generated
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocaleProvider>
      <HtmlWrapper>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <Toaster />
        </body>
      </HtmlWrapper>
    </LocaleProvider>
  );
}
