import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { FederativeUnit } from '@/lib/api-types'
import { UseFormReturn } from 'react-hook-form'

interface AddressFieldsProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
  federativeUnits: FederativeUnit[]
}

export function AddressFields({
  form,
  isLoading,
  t,
  federativeUnits
}: AddressFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('street')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('street')}
                aria-label={t('street')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('street')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('number')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('number')}
                aria-label={t('number')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('number')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="complement"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('complement')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('complementPlaceholder')}
                aria-label={t('complement')}
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('complement')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('neighborhood')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('neighborhood')}
                aria-label={t('neighborhood')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('neighborhood')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('city')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={t('city')}
                aria-label={t('city')}
                aria-required="true"
                disabled={isLoading}
                onBlur={(e) => {
                  field.onBlur()
                  form.trigger('city')
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('federativeUnit')}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label={t('federativeUnit')}
                  aria-required="true"
                >
                  {field.value || 'Selecione'}
                </SelectTrigger>
                <SelectContent>
                  {federativeUnits.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* O campo de CEP pode ser importado como componente isolado */}
    </>
  )
}
