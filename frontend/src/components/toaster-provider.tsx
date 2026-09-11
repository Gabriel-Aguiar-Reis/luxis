'use client'
import { Toaster } from 'sonner'
import { useTheme } from '@/components/theme-provider'

export function ToasterProvider() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      richColors
      closeButton
      position="bottom-right"
    />
  )
}
