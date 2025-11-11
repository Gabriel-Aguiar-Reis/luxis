'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface OnboardingContextType {
  isOnboardingComplete: boolean
  currentStep: number
  totalSteps: number
  completeOnboarding: () => void
  setCurrentStep: (step: number) => void
  skipOnboarding: () => void
  startOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

export function OnboardingProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 5

  useEffect(() => {
    // Verifica se o onboarding já foi completado
    const completed = localStorage.getItem('luxis-onboarding-complete')
    if (completed === 'true') {
      setIsOnboardingComplete(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('luxis-onboarding-complete', 'true')
    setIsOnboardingComplete(true)
    setCurrentStep(0)
  }

  const skipOnboarding = () => {
    localStorage.setItem('luxis-onboarding-complete', 'true')
    setIsOnboardingComplete(true)
    setCurrentStep(0)
  }

  const startOnboarding = () => {
    localStorage.removeItem('luxis-onboarding-complete')
    setIsOnboardingComplete(false)
    setCurrentStep(0)
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        currentStep,
        totalSteps,
        completeOnboarding,
        setCurrentStep,
        skipOnboarding,
        startOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
