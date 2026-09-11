export const phonePattern = /^(\+?55)?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
export const currencyPattern = /^\d+(\.\d{2})$/

export const fieldHints = {
  email: 'Use um email completo, como nome@dominio.com.',
  password:
    'Mínimo 10 caracteres, com maiúscula, minúscula, número e caractere especial.',
  phone: 'Use DDD + numero: (11) 98765-4321 ou 11987654321.',
  name: 'Use entre 2 e 80 caracteres.',
  personName:
    'Comece com letra maiúscula; acentos, cedilha, hífen e espaços são aceitos.',
  currency: 'Use ponto para centavos, como 99.90.',
  quantity: 'Informe pelo menos 1 unidade.',
  installments: 'Informe um número inteiro a partir de 1.',
  installmentInterval:
    'Informe dias inteiros; use 0 para pagamento sem intervalo.',
  postalCode: 'Use 8 dígitos, como 01234567.',
  addressNumber: 'Use apenas o número do endereço, até 99999.',
  imageUrl: 'Cole uma URL completa iniciada por https://.'
} as const

export function onlyPhoneChars(value: string) {
  return value.replace(/[^\d()+\-\s]/g, '')
}
