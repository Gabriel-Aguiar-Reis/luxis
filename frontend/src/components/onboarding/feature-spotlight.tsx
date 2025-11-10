'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, ChevronRight } from 'lucide-react'
import { useOnboarding } from './onboarding-provider'

interface FeatureSpotlightProps {
  targetSelector: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  onComplete?: () => void
}

export function FeatureSpotlight({
  targetSelector,
  title,
  description,
  position = 'bottom',
  onComplete
}: FeatureSpotlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const { isOnboardingComplete } = useOnboarding()

  useEffect(() => {
    if (isOnboardingComplete) return

    const targetElement = document.querySelector(targetSelector)
    if (!targetElement) return

    const rect = targetElement.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Calcula a posição baseada no elemento alvo
    let top = 0
    let left = 0

    switch (position) {
      case 'bottom':
        top = rect.bottom + scrollY + 10
        left = rect.left + scrollX + rect.width / 2
        break
      case 'top':
        top = rect.top + scrollY - 10
        left = rect.left + scrollX + rect.width / 2
        break
      case 'left':
        top = rect.top + scrollY + rect.height / 2
        left = rect.left + scrollX - 10
        break
      case 'right':
        top = rect.top + scrollY + rect.height / 2
        left = rect.right + scrollX + 10
        break
    }

    setCoords({ top, left })
    setIsVisible(true)

    // Adiciona destaque ao elemento
    targetElement.classList.add('spotlight-target')

    return () => {
      targetElement.classList.remove('spotlight-target')
    }
  }, [targetSelector, position, isOnboardingComplete])

  const handleClose = () => {
    setIsVisible(false)
    onComplete?.()
  }

  if (isOnboardingComplete || !isVisible) return null

  return (
    <>
      {/* Overlay escuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
      />

      {/* Card de destaque */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            zIndex: 50
          }}
          className={`transform ${
            position === 'left' || position === 'right'
              ? '-translate-y-1/2'
              : position === 'top'
                ? '-translate-x-1/2 -translate-y-full'
                : '-translate-x-1/2'
          }`}
        >
          <Card className="border-primary w-80 border-2 shadow-xl">
            <CardContent className="p-4">
              {/* <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div> */}
              <p className="text-muted-foreground mb-4 text-sm">
                {description}
              </p>
              <Button onClick={handleClose} size="sm" className="w-full">
                Entendi
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Seta indicadora */}
          <div
            className={`absolute ${
              position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2'
                : position === 'top'
                  ? 'top-full left-1/2 -translate-x-1/2 rotate-180'
                  : position === 'left'
                    ? 'top-1/2 left-full -translate-y-1/2 rotate-90'
                    : 'top-1/2 right-full -translate-y-1/2 -rotate-90'
            }`}
          >
            <div className="border-b-primary h-0 w-0 border-r-8 border-b-8 border-l-8 border-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        .spotlight-target {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
          animation: pulse-spotlight 2s infinite;
        }

        @keyframes pulse-spotlight {
          0%,
          100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </>
  )
}
