'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, Key } from 'lucide-react'
import { useAuthStore } from '@/stores/use-auth-store'

const passwordFormSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
        {
          message:
            'A senha deve ter pelo menos 10 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
        }
      )
      .min(10, {
        message: 'A senha deve ter pelo menos 10 caracteres.'
      }),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
        {
          message:
            'A senha deve ter pelo menos 10 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
        }
      )
      .min(10, {
        message: 'A senha deve ter pelo menos 10 caracteres.'
      })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function SecurityForm() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { changePassword, user } = useAuthStore()

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  })

  const handlePasswordSubmit = (values: PasswordFormValues) => {
    setIsLoading(true)
    if (!user) {
      toast.error('Usuário não encontrado.')
      setIsLoading(false)
      return
    }
    changePassword({
      userId: user.id,
      newPassword: values.newPassword
    })
      .then(() => {
        toast.success('Senha alterada com sucesso!')
        passwordForm.reset()
        setShowPasswordForm(false)
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : 'Erro desconhecido'
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="mx-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center gap-2">
            <Key className="text-primary h-5 w-5" />
            <h3 className="text-lg font-medium">Alteração de Senha</h3>
          </div>

          {!showPasswordForm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  Altere sua senha regularmente para manter sua conta segura.
                </p>
              </div>
              <Button onClick={() => setShowPasswordForm(true)}>
                Alterar Senha
              </Button>
            </div>
          ) : (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Digite sua nova senha"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:bg-transparent"
                            aria-label={
                              showNewPassword
                                ? 'Ocultar senha'
                                : 'Mostrar senha'
                            }
                            onClick={() => setShowNewPassword((v) => !v)}
                          >
                            {showNewPassword ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirme sua nova senha"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:bg-transparent"
                            aria-label={
                              showConfirmPassword
                                ? 'Ocultar senha'
                                : 'Mostrar senha'
                            }
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
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar nova senha'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
