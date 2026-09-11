import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group'
import { fieldHints } from '@/lib/form-guidance'

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
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="space-y-2 relative">
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    autoComplete="new-password"
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
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <FormItem className="mt-4">
            <div className="space-y-2 relative">
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('confirmPasswordPlaceholder')}
                    autoComplete="new-password"
                    aria-label={t('confirmPassword')}
                    aria-required="true"
                    disabled={isLoading}
                    onChange={(e) => {
                      field.onChange(e)
                      if (fieldState.error) {
                        form.trigger('confirmPassword')
                      }
                    }}
                    onBlur={(e) => {
                      field.onBlur()
                      form.trigger('confirmPassword')
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={t('showPassword')}
                      disabled={isLoading}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormDescription>{fieldHints.password}</FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  )
}
