'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from '@/lib/i18n/navigation'
import { toast } from 'sonner'
import { ApiError, apiFetch } from '@/lib/api-client'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NameFields } from '@/components/sign-up/name-fields'
import { EmailField } from '@/components/sign-up/email-field'
import { PhoneField } from '@/components/sign-up/phone-field'
import { AddressFields } from '@/components/sign-up/address-fields'
import { CepField } from '@/components/sign-up/cep-field'
import { PasswordFields } from '@/components/sign-up/password-fields'
import { federativeUnits } from '@/components/sign-up/enums'
import { useCreateUser, CreateUserDto } from '@/hooks/use-users'
import { Country, FederativeUnit } from '@/lib/api-types'
import { useQueryClient } from '@tanstack/react-query'

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const formSchema = z
    .object({
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
      phone: z
        .string()
        .regex(/^(\(?[0-9]{2}\)?)?\s?([0-9]{4,5})-?\s?([0-9]{4})$/, {
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
      country: z.string().min(2, { message: 'País inválido.' }),
      password: z
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
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword']
    })

  type formValues = z.infer<typeof formSchema>
  const t = useTranslations('SignUp')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  const queryClient = useQueryClient()
  const { mutate: createUser } = useCreateUser(queryClient)

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
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
      country: 'BRAZIL' as Country,
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (values: formValues) => {
    setIsLoading(true)
    const payload: CreateUserDto = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      phone: values.phone,
      street: values.street,
      number: Number(values.number),
      complement: values.complement || '',
      neighborhood: values.neighborhood,
      city: values.city,
      federativeUnit: values.state as FederativeUnit,
      postalCode: values.zipCode,
      country: values.country as Country,
      password: values.password
    }
    createUser(payload, {
      onSuccess: () => {
        router.push('/login')
      },
      onError: () => {
        setIsLoading(false)
      }
    })
  }

  const stepFields: Array<Array<keyof formValues>> = [
    ['name', 'surname', 'email', 'phone'],
    [
      'street',
      'number',
      'complement',
      'neighborhood',
      'city',
      'state',
      'zipCode',
      'country'
    ],
    ['password', 'confirmPassword']
  ]

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <Form {...form}>
            <form
              className="p-6 md:p-8"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{t('title')}</h1>
                  <p className="text-muted-foreground text-balance">
                    {t('description')}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        className={
                          'h-2 w-8 rounded-full transition-all ' +
                          (idx === step
                            ? 'bg-primary'
                            : 'bg-muted-foreground/30')
                        }
                        aria-label={`${t('step')} ${idx + 1} ${t('of')} 3`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-4 text-xs">
                      {t('step')} {step + 1} {t('of')} 3
                    </span>
                  </div>
                </div>
                <div style={{ display: step === 0 ? 'block' : 'none' }}>
                  <NameFields form={form} isLoading={isLoading} t={t} />
                  <EmailField form={form} isLoading={isLoading} t={t} />
                  <PhoneField form={form} isLoading={isLoading} t={t} />
                </div>
                <div style={{ display: step === 1 ? 'block' : 'none' }}>
                  <AddressFields
                    form={form}
                    isLoading={isLoading}
                    t={t}
                    federativeUnits={[...federativeUnits] as FederativeUnit[]}
                  />
                  <CepField form={form} isLoading={isLoading} t={t} />
                </div>
                <div style={{ display: step === 2 ? 'block' : 'none' }}>
                  <PasswordFields form={form} isLoading={isLoading} t={t} />
                </div>
                {/* Navigation buttons */}
                <div className="mt-4 flex gap-2">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={isLoading}
                    >
                      {t('back')}
                    </Button>
                  )}
                  {step < 2 ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const valid = await form.trigger(stepFields[step])
                        if (valid) setStep(step + 1)
                      }}
                      disabled={isLoading}
                    >
                      {t('next')}
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? t('loading') : t('signUp')}
                    </Button>
                  )}
                </div>
                <div className="text-center text-sm">
                  {t('haveAccount')}{' '}
                  <a href="/login" className="underline underline-offset-4">
                    {t('login')}
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
