import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ImageURL {
  @ApiProperty({
    description: 'The URL of the product model photo',
    example: 'https://example.com/iphone13.jpg',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid image URL')
    this.value = value
  }

  private validate(value: string): boolean {
    const url = new URL(value)

    if (!url.protocol.startsWith('http') && !url.protocol.startsWith('https')) {
      return false
    }

    const path = url.pathname.toLowerCase()
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const isDummy = url.hostname.includes('dummyimage.com')
    const hasValidExtension = validExtensions.some((ext) => path.endsWith(ext))

    if (!hasValidExtension && !isDummy) return false

    return true
  }

  getValue(): string {
    return this.value
  }
}
