import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

interface NameFieldsProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
}

export function NameFields({ form, isLoading, t }: NameFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('name')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('name')}
                autoFocus
                aria-label={t('name')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('name')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="surname"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('surname')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('surname')}
                aria-label={t('surname')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('surname')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
