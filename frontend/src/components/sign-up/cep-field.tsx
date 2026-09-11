import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group'
import { fieldHints } from '@/lib/form-guidance'

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
      render={({ field, fieldState }) => (
        <FormItem className="mt-4">
          <FormLabel>{t('postalCode')}</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupInput
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '')
                  form.setValue('zipCode', raw)
                  if (fieldState.error) {
                    form.trigger('zipCode')
                  }
                }}
                type="text"
                inputMode="numeric"
                placeholder="01234567"
                aria-label={t('postalCode')}
                aria-required="true"
                disabled={isLoading}
                maxLength={8}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('zipCode')
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>8 digitos</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormDescription>{fieldHints.postalCode}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
