import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { maskPhone } from '@/components/utils/masks'
import { UseFormReturn } from 'react-hook-form'

interface PhoneFieldProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
}

export function PhoneField({ form, isLoading, t }: PhoneFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>{t('phone')}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                form.setValue('phone', raw)
              }}
              type="tel"
              placeholder={t('phoneNumber')}
              autoComplete="tel"
              aria-label={t('phone')}
              aria-required="true"
              disabled={isLoading}
              onBlur={(e) => {
                field.onBlur()
                form.trigger('phone')
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
