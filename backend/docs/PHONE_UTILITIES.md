# Phone Number Utilities

Este módulo fornece utilitários flexíveis para lidar com números de telefone em diversos formatos.

## 🎯 Filosofia

Ao invés de rejeitar inputs com formatos diferentes, **normalizamos e limpamos** os números de telefone automaticamente. Isso proporciona uma melhor experiência do usuário e reduz erros de validação.

## 📦 Utilitários Disponíveis

### `cleanPhoneNumber(phone: string): string`

Remove todos os caracteres não-numéricos de um número de telefone.

```typescript
import { cleanPhoneNumber } from '@/shared/common/utils/phone.helper'

cleanPhoneNumber('(11) 98765-4321') // '11987654321'
cleanPhoneNumber('+55 11 98765-4321') // '5511987654321'
cleanPhoneNumber('11 9 8765-4321') // '11987654321'
```

### `isValidPhoneLength(cleanedPhone: string): boolean`

Valida se um número limpo tem um tamanho válido para telefones brasileiros.

Aceita:

- **10 dígitos**: Telefone fixo (ex: `1134567890`)
- **11 dígitos**: Celular (ex: `11987654321`)
- **12 dígitos**: Fixo com código do país (ex: `551134567890`)
- **13 dígitos**: Celular com código do país (ex: `5511987654321`)

```typescript
import { isValidPhoneLength } from '@/shared/common/utils/phone.helper'

isValidPhoneLength('11987654321') // true - celular
isValidPhoneLength('1134567890') // true - fixo
isValidPhoneLength('123456') // false - muito curto
```

### `formatPhoneNumber(cleanedPhone: string): string`

Formata um número limpo para exibição visual.

```typescript
import { formatPhoneNumber } from '@/shared/common/utils/phone.helper'

formatPhoneNumber('11987654321') // '(11) 98765-4321'
formatPhoneNumber('1134567890') // '(11) 3456-7890'
formatPhoneNumber('5511987654321') // '+55 (11) 98765-4321'
```

### `normalizePhoneNumber(phone: string)`

Função completa que limpa, valida e formata em uma única chamada.

```typescript
import { normalizePhoneNumber } from '@/shared/common/utils/phone.helper'

const result = normalizePhoneNumber('(11) 98765-4321')
// {
//   cleaned: '11987654321',
//   isValid: true,
//   formatted: '(11) 98765-4321'
// }
```

## 🔧 Value Object PhoneNumber

O Value Object `PhoneNumber` foi atualizado para usar esses utilitários, aceitando diversos formatos:

```typescript
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'

// ✅ Todos esses formatos são aceitos:
new PhoneNumber('(11) 98765-4321')
new PhoneNumber('11 98765-4321')
new PhoneNumber('11-98765-4321')
new PhoneNumber('11987654321')
new PhoneNumber('+55 11 98765-4321')
new PhoneNumber('5511987654321')

// ❌ Apenas rejeitado se não tiver 10-13 dígitos
new PhoneNumber('123') // Throws BadRequestException
```

### Métodos disponíveis:

```typescript
const phone = new PhoneNumber('(11) 98765-4321')

phone.getValue() // '11987654321' - apenas dígitos
phone.getFormatted() // '(11) 98765-4321' - formatado para exibição
```

## 📝 Uso nos Use Cases

```typescript
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'

// O Value Object automaticamente limpa e valida
const customer = new Customer(
  id,
  name,
  new PhoneNumber(dto.phone) // Aceita qualquer formato válido
)

// Para exibir, use getFormatted()
console.log(customer.phone.getFormatted()) // '(11) 98765-4321'
```

## ✅ Benefícios

1. **Flexibilidade**: Aceita múltiplos formatos de entrada
2. **Normalização**: Armazena sempre no mesmo formato (apenas dígitos)
3. **Validação**: Garante que o número tem tamanho válido
4. **Formatação**: Fácil exibição em formato legível
5. **Menos erros**: Usuários não são rejeitados por usar formatos diferentes

## 🧪 Testes

Todos os utilitários possuem testes unitários completos em:
`test/unit/shared/utils/phone.helper.spec.ts`

Execute com:

```bash
npm run test:unit -- phone.helper.spec.ts
```
