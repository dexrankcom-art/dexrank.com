'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { WebVitals } from './_components/web-vitals';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>{children}</NuqsAdapter>
      <WebVitals />
    </ThemeProvider>
  );
}
