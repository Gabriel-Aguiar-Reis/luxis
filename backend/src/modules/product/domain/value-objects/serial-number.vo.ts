import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class SerialNumber {
  @ApiProperty({
    description: 'The serial number of the product',
    example: '0424A-BR-BAB-001',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!SerialNumber.isValid(value)) {
      throw new BadRequestException(`Invalid serial number format: ${value}`)
    }
    this.value = value
  }

  static generate(
    batchDate: Date,
    batchIndex: number,
    categoryCode: string,
    modelName: ModelName,
    productIndex: number
  ): SerialNumber {
    const batchCode = SerialNumber.formatBatchCode(batchDate, batchIndex)
    const modelAbbr = SerialNumber.abbreviate(modelName.getValue())
    const seq = String(productIndex + 1).padStart(3, '0')
    const serial = `${batchCode}-${categoryCode}-${modelAbbr}-${seq}`
    return new SerialNumber(serial)
  }

  getValue(): string {
    return this.value
  }

  static isValid(serial: string): boolean {
    return /^[0-9]{4}[A-Z]-[A-Z]{2}-[A-Z]{2,4}-[0-9]{3}$/.test(serial)
  }

  private static formatBatchCode(date: Date, index: number): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yy = String(date.getFullYear()).slice(-2)
    const letter = String.fromCharCode(65 + index) // A, B, C...
    return `${mm}${yy}${letter}`
  }

  private static abbreviate(name: string): string {
    // Remove accents and replace ç with c
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/ç/gi, 'c')

    const cleanName = normalize(name)
    const words = cleanName.trim().split(/\s+/)

    if (words.length === 1) {
      return words[0].slice(0, 3).toUpperCase()
    }

    if (words.length === 2) {
      const first = words[0][0]
      const second = words[1].slice(0, 2)
      return (first + second).toUpperCase()
    }

    if (words.length === 3) {
      return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
    }

    return (
      words[0][0] +
      words[1][0] +
      words[words.length - 1][0]
    ).toUpperCase()
  }
}
