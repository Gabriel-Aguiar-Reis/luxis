import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { Mail } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui/input-group'
import { fieldHints } from '@/lib/form-guidance'

interface EmailFieldProps {
  form: UseFormReturn<any>
  isLoading: boolean
  t: (key: string) => string
}

export function EmailField({ form, isLoading, t }: EmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field, fieldState }) => (
        <FormItem className="mt-4">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupAddon>
                <Mail aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                type="email"
                placeholder="email@luxis.com"
                autoComplete="email"
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
  )
}
