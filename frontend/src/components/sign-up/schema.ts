import { z } from 'zod'
import { phonePattern } from '@/lib/form-guidance'

const personNamePattern =
  /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e)([- ]([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e))*$/

export const signUpSchema = z
  .object({
    name: z
      .string()
      .regex(
        personNamePattern,
        'Nome inválido. Comece com letra maiúscula; acentos, cedilha, hífen e espaços são aceitos.'
      ),
    surname: z
      .string()
      .regex(
        personNamePattern,
        'Sobrenome inválido. Comece com letra maiúscula; acentos, cedilha, hífen e espaços são aceitos.'
      ),
    email: z.string().email('Email inválido'),
    phone: z
      .string()
      .regex(
        phonePattern,
        'Telefone inválido. Use DDD + número, como (11) 98765-4321.'
      ),
    street: z
      .string()
      .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Rua inválida. Apenas letras e espaços.'),
    number: z
      .number()
      .min(1, 'Número é obrigatório')
      .max(99999, 'Número inválido'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    federativeUnit: z.string().min(2, 'UF obrigatória'),
    postalCode: z
      .string()
      .regex(/^\d{5}\d{3}$/, 'CEP inválido. Formato esperado: 12345678'),
    country: z.string().min(2, 'País é obrigatório'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
        'Senha inválida. Deve conter pelo menos 10 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.'
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
        'Confirmação de senha inválida. Deve conter pelo menos 10 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.'
      )
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })
