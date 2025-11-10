'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/use-auth-store'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Login')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, verify } = useAuthStore()

  const loginSchema = z.object({
    email: z.string().email(t('emailInvalid')),
    password: z.string().min(10, t('passwordMinLength'))
  })
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await login(values)
      const { user } = await verify()

      // Verifica se é revendedor
      if (user.role !== 'RESELLER') {
        toast.error('Acesso negado. Este login é exclusivo para revendedores.')
        setIsLoading(false)
        return
      }

      // Verifica se a conta está ativa
      if (user.status !== 'ACTIVE') {
        toast.error(t('inactiveAccount'))
        setIsLoading(false)
        return
      }

      toast.success(t('successMessage'))
      router.push('/my-space')
    } catch (error) {
      let errorMessage = t('authError')
      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
      console.error('Erro de login:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              className="p-6 md:p-8"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{t('title')}</h1>
                  <p className="text-muted-foreground text-balance">
                    {t('description')}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
                      Acesso exclusivo para revendedores
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@luxis.com"
                          autoComplete="email"
                          autoFocus
                          aria-label={t('email')}
                          aria-required="true"
                          disabled={isLoading}
                          onBlur={(e) => {
                            field.onBlur()
                            form.trigger('email')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative space-y-2">
                        <div className="flex items-center">
                          <FormLabel>{t('password')}</FormLabel>
                          <a
                            href="/forgot-password"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            {t('forgotPassword')}
                          </a>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t('passwordPlaceholder')}
                              autoComplete="current-password"
                              aria-label={t('password')}
                              aria-required="true"
                              disabled={isLoading}
                              onBlur={(e) => {
                                field.onBlur()
                                form.trigger('password')
                              }}
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent focus:bg-transparent"
                              aria-label={t('showPassword')}
                              disabled={isLoading}
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('loading') : t('button')}
                </Button>
              </div>
              <div className="mt-2 text-center text-sm">
                {t('dontHaveAccount')}{' '}
                <a href="/sign-up" className="underline underline-offset-4">
                  {t('signUp')}
                </a>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/luxis-light.png"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
