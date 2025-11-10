import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Name {
  @ApiProperty({ description: 'The name of the user', type: String })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid name format')
    this.value = value
  }

  private validate(name: string): boolean {
    // Permite nomes com letras (maiúsculas e minúsculas), acentos, hífen, espaço e preposições
    // Exemplos válidos: "João Silva", "Maria de Souza", "Ana-Paula", "José da Costa"
    const namePattern =
      /^([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ']+|de|da|do|dos|das|e)([- ]([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ']+|de|da|do|dos|das|e))*$/
    return namePattern.test(name.trim())
  }

  getValue(): string {
    return this.value
  }
}
