'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const SESSION_EXPIRED_EVENT = 'luxis:session-expired'

export function SessionFeedbackListener() {
  const t = useTranslations('Common')

  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error(t('SessionExpired'))
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [t])

  return null
}
