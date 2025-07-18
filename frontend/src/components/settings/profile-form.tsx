'use client'

import { useEffect, useState } from 'react'
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
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/use-auth-store'
import { apiFetch } from '@/lib/api-client'
import { User } from '@/lib/api-types'
import { apiPaths } from '@/lib/api-paths'
import { UpdateUser } from '@/lib/api-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const profileFormSchema = z.object({
  name: z
    .string()
    .regex(
      /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e)([- ]([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e))*$/,
      {
        message:
          'O nome deve ter pelo menos 2 caracteres. O nome pode conter letras acentuadas, hífen, cedilha e palavras minúsculas comuns.'
      }
    ),
  surname: z
    .string()
    .regex(
      /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e)([- ]([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e))*$/,
      {
        message:
          'O sobrenome deve ter pelo menos 2 caracteres. O sobrenome pode conter letras acentuadas, hífen, cedilha e palavras minúsculas comuns.'
      }
    ),
  email: z.string().email({
    message: 'Email inválido.'
  }),
  phone: z.string().regex(/^(\(?[0-9]{2}\)?)?\s?([0-9]{4,5})-?\s?([0-9]{4})$/, {
    message:
      'Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.'
  }),
  street: z.string().min(3, { message: 'Rua inválida.' }),
  number: z.string().min(1, { message: 'Número inválido.' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro inválido.' }),
  city: z.string().min(2, { message: 'Cidade inválida.' }),
  state: z.string().min(2, { message: 'UF inválida.' }),
  zipCode: z.string().min(5, { message: 'CEP inválido.' }),
  country: z.string().min(2, { message: 'País inválido.' })
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type updateUserDto = UpdateUser['requestBody']['content']['application/json']
type FederativeUnit = User['residence']['address']['federativeUnit']

export function ProfileForm() {
  const [data, setData] = useState<User | null>(null)
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const FederativeUnits = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ] as FederativeUnit[]

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: 'SP' as FederativeUnit,
      zipCode: '',
      country: ''
    }
  })

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true)
    try {
      if (!user) {
        toast.error('Usuário não encontrado.')
        return
      }
      const payload: updateUserDto = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: values.phone,
        street: values.street,
        number: Number(values.number),
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city,
        federativeUnit: values.state as FederativeUnit,
        postalCode: values.zipCode,
        country: 'Brasil'
      }

      await apiFetch(
        apiPaths.users.byId(user.id),
        {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        true,
        'PATCH'
      )
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      toast.error('Usuário não encontrado.')
      return
    }
    const fetchUserData = async () => {
      try {
        const response = await apiFetch<User>(
          apiPaths.users.byId(user.id),
          {},
          true
        )
        setData(response)
      } catch (error) {
        toast.error('Erro ao carregar os dados do usuário.')
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name?.value || '',
        surname: data?.surname?.value || '',
        email: data?.email?.value || '',
        phone: data?.phone?.value || '',
        street: data?.residence?.address?.street || '',
        number: data?.residence?.address?.number?.toString() || '',
        complement: data?.residence?.address?.complement || '',
        neighborhood: data?.residence?.address?.neighborhood || '',
        city: data?.residence?.address?.city || '',
        state: data?.residence?.address?.federativeUnit || '',
        zipCode: data?.residence?.address?.postalCode?.value?.toString() || '',
        country: data?.residence?.address?.country || ''
      })
    }
  }, [data, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-4 space-y-6"
      >
        <Card>
          <CardTitle className="mx-4 text-lg font-medium">
            Dados Pessoais
          </CardTitle>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardTitle className="mx-4 text-lg font-medium">Endereço</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {FederativeUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
