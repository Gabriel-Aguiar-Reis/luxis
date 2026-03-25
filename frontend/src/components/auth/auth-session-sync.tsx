'use client'

import { useEffect } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { useAuthStore } from '@/stores/use-auth-store'
import { notifySessionExpired } from '@/lib/session-feedback'

type AuthSessionSyncProps = {
  expectedRole: 'ADMIN' | 'RESELLER'
  redirectTo: '/admin-login' | '/login'
}

export function AuthSessionSync({
  expectedRole,
  redirectTo
}: AuthSessionSyncProps) {
  const router = useRouter()
  const { hydrated, isAuthenticated, logout, user, verify } = useAuthStore()

  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (user?.role === expectedRole && user.status === 'ACTIVE') {
      return
    }

    let isCancelled = false

    void verify()
      .then((result) => {
        if (isCancelled) {
          return
        }

        if (
          !result.user ||
          result.user.role !== expectedRole ||
          result.user.status !== 'ACTIVE'
        ) {
          logout()
          router.replace(redirectTo)
        }
      })
      .catch(() => {
        if (isCancelled) {
          return
        }

        if (user || isAuthenticated) {
          notifySessionExpired()
        }

        router.replace(redirectTo)
      })

    return () => {
      isCancelled = true
    }
  }, [
    expectedRole,
    hydrated,
    isAuthenticated,
    logout,
    redirectTo,
    router,
    user,
    verify
  ])

  return null
}
