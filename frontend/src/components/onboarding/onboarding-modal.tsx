'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import { useOnboarding } from './onboarding-provider'
import { useTranslations } from 'next-intl'
import {
  ChevronRight,
  ChevronLeft,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Sparkles
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
  image?: string
}

export function OnboardingModal() {
  const {
    isOnboardingComplete,
    currentStep,
    totalSteps,
    setCurrentStep,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding()
  const t = useTranslations('Onboarding')
  const [open, setOpen] = useState(false)

  const steps: OnboardingStep[] = [
    {
      title: t('welcome.title'),
      description: t('welcome.description'),
      icon: <Sparkles className="h-16 w-16 text-blue-500" />
    },
    {
      title: t('inventory.title'),
      description: t('inventory.description'),
      icon: <Package className="h-16 w-16 text-purple-500" />
    },
    {
      title: t('customers.title'),
      description: t('customers.description'),
      icon: <Users className="h-16 w-16 text-green-500" />
    },
    {
      title: t('sales.title'),
      description: t('sales.description'),
      icon: <ShoppingCart className="h-16 w-16 text-orange-500" />
    },
    {
      title: t('dashboard.title'),
      description: t('dashboard.description'),
      icon: <BarChart3 className="h-16 w-16 text-pink-500" />
    }
  ]

  useEffect(() => {
    // Abre o modal apenas se o onboarding não foi completado
    if (!isOnboardingComplete) {
      setOpen(true)
    }
  }, [isOnboardingComplete])

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    setOpen(false)
  }

  const handleSkip = () => {
    skipOnboarding()
    setOpen(false)
  }

  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">
          {steps[currentStep].title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {steps[currentStep].description}
        </DialogDescription>
        <div className="p-8">
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="text-muted-foreground mt-2 text-center text-sm">
              {t('step')} {currentStep + 1} {t('of')} {totalSteps}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {steps[currentStep].icon}
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground max-w-md text-lg">
                  {steps[currentStep].description}
                </p>
              </div>

              {steps[currentStep].image && (
                <motion.img
                  src={steps[currentStep].image}
                  alt={steps[currentStep].title}
                  className="max-h-64 rounded-lg object-cover shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('previous')}
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-8'
                      : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentStep === totalSteps - 1 ? (
              <Button onClick={handleComplete}>
                {t('getStarted')}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {t('next')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
