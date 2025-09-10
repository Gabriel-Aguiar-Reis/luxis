'use client'

import { CashierForm } from '@/components/cashier-form'
import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/use-auth-store'

export default function CashierPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('Cashier')

  const { isAuthenticated, verify, user, logout } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verify()
        if (!isAuthenticated || !user) {
          throw new Error(t('authError'))
        }
        if (user.role !== 'RESELLER' || user.status !== 'ACTIVE') {
          throw new Error(t('authError'))
        }
        setIsLoading(false)
      } catch (error) {
        const errorMessage =
          error instanceof Error && error.message === t('sessionExpired')
            ? t('sessionExpired')
            : t('authError')
        toast.error(errorMessage)
        logout()
        router.push('/cashier-login')
      }
    }

    checkAuth()
  }, [router, t])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </header>

        <CashierForm />
      </div>
    </div>
  )
}
