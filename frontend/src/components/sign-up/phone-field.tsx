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
import { fieldHints, onlyPhoneChars } from '@/lib/form-guidance'

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
      render={({ field, fieldState }) => (
        <FormItem className="mt-4">
          <FormLabel>{t('phone')}</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>+55</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  form.setValue('phone', onlyPhoneChars(e.target.value))
                  if (fieldState.error) {
                    form.trigger('phone')
                  }
                }}
                type="tel"
                placeholder="(11) 98765-4321"
                autoComplete="tel"
                aria-label={t('phone')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('phone')
                }}
              />
            </InputGroup>
          </FormControl>
          <FormDescription>{fieldHints.phone}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
