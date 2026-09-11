import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions
} from 'class-validator'
import { normalizePhoneNumber } from '@/shared/common/utils/phone.helper'

export function IsBrazilianPhone(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isBrazilianPhone',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'Telefone deve ter DDD e 10 ou 11 digitos, como (11) 98765-4321.',
        ...validationOptions
      },
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'string' && normalizePhoneNumber(value).isValid
          )
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ter DDD e 10 ou 11 digitos, como (11) 98765-4321.`
        }
      }
    })
  }
}
