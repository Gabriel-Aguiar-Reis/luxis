'use client'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/use-auth-store'
import { Eye, EyeOff, Mail } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group'
import { fieldHints } from '@/lib/form-guidance'

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Login')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login, logout } = useAuthStore()

  const adminLoginSchema = z.object({
    email: z.string().email(t('emailInvalid')),
    password: z.string().min(10, t('passwordMinLength'))
  })

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const user = await login(values)
      if (user.role !== 'ADMIN') {
        logout()
        toast.error(t('authError'))
        setIsLoading(false)
        return
      }
      if (user.status !== 'ACTIVE') {
        logout()
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
                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20">
                      {t('adminOnlyBadge')}
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <Mail aria-hidden="true" />
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            type="email"
                            placeholder="admin@luxis.com"
                            autoComplete="email"
                            autoFocus
                            aria-label="Email"
                            aria-required="true"
                            disabled={isLoading}
                            onChange={(e) => {
                              field.onChange(e)
                              if (fieldState.error) {
                                form.trigger('email')
                              }
                            }}
                            onBlur={(e) => {
                              field.onBlur()
                              form.trigger('email')
                            }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormDescription>{fieldHints.email}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
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
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('passwordPlaceholder')}
                            autoComplete="current-password"
                            aria-label={t('password')}
                            aria-required="true"
                            disabled={isLoading}
                            onChange={(e) => {
                              field.onChange(e)
                              if (fieldState.error) {
                                form.trigger('password')
                              }
                            }}
                            onBlur={(e) => {
                              field.onBlur()
                              form.trigger('password')
                            }}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              size="icon-xs"
                              aria-label={t('showPassword')}
                              disabled={isLoading}
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? <Eye /> : <EyeOff />}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormDescription>{fieldHints.password}</FormDescription>
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t('restrictedArea')} <a href="/login">{t('restrictedAreaHref')}</a>.
      </div>
    </div>
  )
}
