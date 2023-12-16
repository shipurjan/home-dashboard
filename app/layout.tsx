import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const font = Jost({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin-ext']
});

export const metadata: Metadata = {
  title: 'Home Dashboard',
  description: 'Home Dashboard'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn('w-screen h-screen p-2', font.className)}>
        {children}
      </body>
    </html>
  );
}
