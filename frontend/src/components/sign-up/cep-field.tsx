import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

interface CepFieldProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
}

export function CepField({ form, isLoading, t }: CepFieldProps) {
  return (
    <FormField
      control={form.control}
      name="zipCode"
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>{t('postalCode')}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                form.setValue('zipCode', raw)
              }}
              type="text"
              placeholder={t('postalCodePlaceholder')}
              aria-label={t('postalCode')}
              aria-required="true"
              disabled={isLoading}
              onBlur={(e) => {
                field.onBlur()
                form.trigger('zipCode')
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
