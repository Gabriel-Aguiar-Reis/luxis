'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useOnboarding } from './onboarding-provider'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export function OnboardingSettings() {
  const { startOnboarding, isOnboardingComplete } = useOnboarding()
  const t = useTranslations('Settings')

  const handleStartOnboarding = () => {
    startOnboarding()
    toast.success('Tour de boas-vindas reiniciado!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Tour de Boas-Vindas
        </CardTitle>
        <CardDescription>
          Reveja as principais funcionalidades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">
              {isOnboardingComplete
                ? 'Você já completou o tour de boas-vindas. Clique no botão ao lado para vê-lo novamente.'
                : 'O tour de boas-vindas está ativo. Complete-o ou pule para não vê-lo novamente.'}
            </p>
          </div>
          <Button
            onClick={handleStartOnboarding}
            variant="outline"
            className="ml-4"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isOnboardingComplete ? 'Iniciar Novamente' : 'Ver Tour'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
