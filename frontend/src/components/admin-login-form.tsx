'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
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
import { useAuthStore } from '@/stores/use-auth-store'
import { Eye, EyeOff } from 'lucide-react'

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Login')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login, verify } = useAuthStore()

  const adminLoginSchema = z.object({
    email: z.string().email(t('emailInvalid')),
    password: z.string().min(10, t('passwordMinLength'))
  })

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await login(values)
      const user = (await verify()).user
      if (user.role !== 'ADMIN') {
        toast.error(t('authError'))
        setIsLoading(false)
        return
      }
      if (user.status !== 'ACTIVE') {
        toast.error(t('inactiveAccount'))
        setIsLoading(false)
        return
      }
      toast.success(t('successMessage'))
      router.push('/home')
    } catch (error) {
      let errorMessage = t('authError')
      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
      console.error(t('authError'), error)
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
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@luxis.com"
                          autoComplete="email"
                          autoFocus
                          aria-label="Email"
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
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:bg-transparent"
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
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('loading') : t('button')}
                </Button>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/luxis-light.png"
                alt={t('title')}
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
              />
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs">
        {t('restrictedArea')} <a href="/login">{t('restrictedAreaHref')}</a>.
      </div>
    </div>
  )
}
