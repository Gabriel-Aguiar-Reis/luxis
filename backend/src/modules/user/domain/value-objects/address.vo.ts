import { Country } from '@/modules/user/domain/enums/country.enum'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { BadRequestException } from '@nestjs/common'

export class Address {
  constructor(
    public readonly street: string,
    public readonly number: number,
    public readonly neighborhood: string,
    public readonly city: string,
    public readonly federativeUnit: FederativeUnit,
    public readonly postalCode: PostalCode,
    public readonly country: Country,
    public readonly complement?: string
  ) {
    if (
      !street ||
      !number ||
      !neighborhood ||
      !city ||
      !federativeUnit ||
      !postalCode ||
      !country
    ) {
      throw new BadRequestException('Invalid address')
    }
  }

  getValue(): string {
    if (this.complement) {
      return `${this.street}, ${this.number}, ${this.complement} - ${this.neighborhood}, ${this.city} - ${this.federativeUnit}, ${this.postalCode.getValue()}, ${this.country}`
    }
    return `${this.street}, ${this.number} - ${this.neighborhood}, ${this.city} - ${this.federativeUnit}, ${this.postalCode.getValue()}, ${this.country}`
  }
}
