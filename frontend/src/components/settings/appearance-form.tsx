'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'])
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: 'system'
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const { setTheme } = useTheme()

  const handleSubmit = (values: AppearanceFormValues) => {
    setIsLoading(true)
    setTheme(values.theme)
    toast.success('Configurações de aparência atualizadas com sucesso!')
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-4 space-y-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-2">
              <Palette className="text-primary h-5 w-5" />
              <h3 className="text-lg font-medium">Tema</h3>
            </div>

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormDescription>
                    Escolha o tema de cores para a interface do sistema.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="border-muted hover:border-accent cursor-pointer items-center rounded-md border-2 p-4">
                            <Sun className="mb-2 h-5 w-5" />
                            <div className="font-medium">Claro</div>
                            <div className="text-muted-foreground text-xs">
                              Tema com fundo claro
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="border-muted hover:border-accent cursor-pointer items-center rounded-md border-2 p-4">
                            <Moon className="mb-2 h-5 w-5" />
                            <div className="font-medium">Escuro</div>
                            <div className="text-muted-foreground text-xs">
                              Tema com fundo escuro
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="system"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="border-muted hover:border-accent cursor-pointer items-center rounded-md border-2 p-4">
                            <Monitor className="mb-2 h-5 w-5" />
                            <div className="font-medium">Sistema</div>
                            <div className="text-muted-foreground text-xs">
                              Segue o tema do sistema
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar preferências'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
