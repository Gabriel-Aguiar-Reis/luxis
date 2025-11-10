'use client'
import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter } from '@/lib/i18n/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user || user.role === 'UNASSIGNED') {
      router.push(`/sign-up`)
      return
    }
    if (user.role === 'ADMIN' || user.role === 'ASSISTANT') {
      router.push(`/home`)
      return
    }
    if (user.role === 'RESELLER') {
      router.push(`/my-space`)
      return
    }
  }, [user, router])

  return null
}
