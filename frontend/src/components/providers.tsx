'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { ToasterProvider } from '@/components/toaster-provider'
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider'
import { MockApiProvider } from '@/components/mock-api-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockApiProvider>
      <ThemeProvider defaultTheme="system">
        <OnboardingProvider>
          <QueryProvider>
            <>{children}</>
          </QueryProvider>
          <ToasterProvider />
        </OnboardingProvider>
      </ThemeProvider>
    </MockApiProvider>
  )
}
