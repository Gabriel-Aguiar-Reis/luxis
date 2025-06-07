import { BadRequestException } from '@nestjs/common'

export class ImageURL {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid image URL')
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
