'use client'

import { ResellerSidebar } from '@/components/reseller-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/use-auth-store'

export default function ResellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('MySpaceLayout')
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
        router.push('/login')
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
    <SidebarProvider>
      <ResellerSidebar />
      <SidebarInset className="flex flex-col">{children}</SidebarInset>
    </SidebarProvider>
  )
}
