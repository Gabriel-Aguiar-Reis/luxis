import { Country } from '@/modules/user/domain/enums/country.enum'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Address {
  @ApiProperty({
    description: 'The street of the address',
    example: 'Rua do Sistema',
    type: String
  })
  public street: string
  @ApiProperty({
    description: 'The number of the address',
    example: 1,
    type: Number
  })
  public number: number
  @ApiProperty({
    description: 'The neighborhood of the address',
    example: 'Centro',
    type: String
  })
  public neighborhood: string
  @ApiProperty({
    description: 'The city of the address',
    example: 'São Paulo',
    type: String
  })
  public city: string
  @ApiProperty({
    description: 'The federative unit of the address',
    example: FederativeUnit.SP,
    enum: FederativeUnit,
  })
  public federativeUnit: FederativeUnit
  @ApiProperty({
    description: 'The postal code of the address',
    example: '01001000',
    type: PostalCode
  })
  public postalCode: PostalCode
  @ApiProperty({
    description: 'The country of the address',
    example: Country.BRAZIL,
    enum: Country,
  })
  public country: Country
  @ApiProperty({
    description: 'The complement of the address',
    example: 'Apto 101',
    type: String
  })
  public complement?: string

  constructor(
    street: string,
    number: number,
    neighborhood: string,
    city: string,
    federativeUnit: FederativeUnit,
    postalCode: PostalCode,
    country: Country,
    complement?: string
  ) {
    this.street = street
    this.number = number
    this.neighborhood = neighborhood
    this.city = city
    this.federativeUnit = federativeUnit
    this.postalCode = postalCode
    this.country = country
    this.complement = complement
    if (
      !this.street ||
      !this.number ||
      !this.neighborhood ||
      !this.city ||
      !this.federativeUnit ||
      !this.postalCode ||
      !this.country
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
