'use client'

import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/use-auth-store'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('HomeLayout')
  const { verify, logout, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    // Se já está autenticado e tem user, não precisa verificar novamente
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN' && user.status === 'ACTIVE') {
        setIsLoading(false)
        return
      }
    }

    const checkAuth = async () => {
      try {
        const result = await verify()

        if (
          !result.user ||
          result.user.role !== 'ADMIN' ||
          result.user.status !== 'ACTIVE'
        ) {
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
        router.push('/admin-login')
      }
    }

    checkAuth()
  }, []) // Removido dependências para executar apenas no mount inicial

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
