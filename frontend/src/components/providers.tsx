'use client'

import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/lib/providers/query-provider'
import { ToasterProvider } from '@/components/toaster-provider'
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OnboardingProvider>
        <QueryProvider>
          <>{children}</>
        </QueryProvider>
        <ToasterProvider />
      </OnboardingProvider>
    </ThemeProvider>
  )
}
