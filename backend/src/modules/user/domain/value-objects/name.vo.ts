import { BadRequestException } from '@nestjs/common'

export class Name {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid name format')
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
