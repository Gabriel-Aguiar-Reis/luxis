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
    // Permite nomes com letras acentuadas, hífen, cedilha e palavras minúsculas comuns
    return /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e)([- ]([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+|de|da|do|dos|das|e))*$/.test(
      name
    )
  }

  getValue(): string {
    return this.value
  }
}
