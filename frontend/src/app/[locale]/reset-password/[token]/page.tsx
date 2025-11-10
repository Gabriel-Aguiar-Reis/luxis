'use client'
import { use } from 'react'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

interface ResetPasswordPageProps {
  params: Promise<{
    token: string
  }>
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = use(params)

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
