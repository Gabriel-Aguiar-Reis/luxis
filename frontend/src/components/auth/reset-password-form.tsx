'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/lib/i18n/navigation'
import { useSearchParams } from 'next/navigation'
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

const formSchema = z
  .object({
    password: z
      .string()
      .min(10, 'A senha deve ter pelo menos 10 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

type FormValues = z.infer<typeof formSchema>

interface ResetPasswordFormProps extends React.ComponentProps<'div'> {
  token: string
}

export function ResetPasswordForm({
  token: tokenProp,
  className,
  ...props
}: ResetPasswordFormProps) {
  const t = useTranslations('ResetPassword')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(tokenProp)

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição inválido')
      router.push('/login')
    }
  }, [token, router])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  async function onSubmit(data: FormValues) {
    if (!token) {
      toast.error('Token de redefinição inválido')
      return
    }

    setIsLoading(true)
    try {
      await apiFetch(
        apiPaths.auth.resetPassword,
        {
          body: JSON.stringify({
            token,
            newPassword: data.password
          })
        },
        false,
        'POST'
      )
      toast.success('Senha redefinida com sucesso!')
      router.push('/login')
    } catch (error) {
      let errorMessage = t('errorMessage')
      if (error instanceof ApiError && error.data?.message) {
        errorMessage = error.data.message
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      console.error('Erro ao redefinir senha:', error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return null
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
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }: { field: any }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>{t('confirmPassword')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
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
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
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
