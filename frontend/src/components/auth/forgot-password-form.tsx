'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/lib/i18n/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ApiError, apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'

/**
 * Password Reset Flow (Manual Approval):
 * 1. User submits email via this form
 * 2. Backend creates a PasswordResetRequest with status PENDING
 * 3. Admin reviews request in admin panel
 * 4. Admin approves/rejects the request
 * 5. If approved, admin copies the reset link and shares with user manually
 * 6. User uses the link to reset password via ResetPasswordForm
 *
 * NOTE: No emails are sent automatically - admin manually shares the reset link
 */

const formSchema = z.object({
  email: z.string().email()
})

type FormValues = z.infer<typeof formSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('ForgotPassword')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      await apiFetch(
        apiPaths.auth.forgotPassword,
        {
          body: JSON.stringify(data)
        },
        false,
        'POST'
      )
      toast.success(
        'Solicitação enviada com sucesso. Aguarde a aprovação do administrador.'
      )
      router.push('/login')
    } catch (error) {
      let errorMessage = t('errorMessage')
      if (error instanceof ApiError && error.data?.message) {
        errorMessage = error.data.message
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      console.error('Erro ao solicitar recuperação de senha:', error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{t('title')}</h1>
                  <p className="text-muted-foreground text-balance">
                    {t('description')}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('loading') : t('button')}
                </Button>
                <div className="text-center text-sm">
                  <a href="/login" className="underline underline-offset-4">
                    {t('backToLogin')}
                  </a>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/luxis-light.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t('termsText')} <a href="#">{t('termsLink')}</a> {t('andText')}{' '}
        <a href="#">{t('privacyLink')}</a>.
      </div>
    </div>
  )
}
