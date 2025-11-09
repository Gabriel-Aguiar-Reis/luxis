import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordFieldsProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
}

export function PasswordFields({ form, isLoading, t }: PasswordFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-2 relative">
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    autoComplete="new-password"
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
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="mt-4">
            <div className="space-y-2 relative">
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('confirmPasswordPlaceholder')}
                    autoComplete="new-password"
                    aria-label={t('confirmPassword')}
                    aria-required="true"
                    disabled={isLoading}
                    onBlur={(e) => {
                      field.onBlur()
                      form.trigger('confirmPassword')
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:bg-transparent"
                    aria-label={t('showPassword')}
                    disabled={isLoading}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
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
    </>
  )
}
