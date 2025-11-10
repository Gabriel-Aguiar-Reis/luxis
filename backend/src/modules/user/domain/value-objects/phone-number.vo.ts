import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import {
  cleanPhoneNumber,
  isValidPhoneLength,
  formatPhoneNumber
} from '@/shared/common/utils/phone.helper'

/**
 * Phone Number Value Object
 * Accepts various phone number formats and normalizes them
 * Examples of accepted formats:
 * - (11) 98765-4321
 * - 11 98765-4321
 * - 11987654321
 * - +55 11 98765-4321
 * - 5511987654321
 */
export class PhoneNumber {
  @ApiProperty({
    description: 'The phone number (stored as digits only)',
    type: String,
    example: '11987654321'
  })
  private value: string

  constructor(value: string) {
    const cleaned = cleanPhoneNumber(value)

    if (!isValidPhoneLength(cleaned)) {
      throw new BadRequestException(
        'Invalid phone number: must have 10-13 digits (with or without country code)'
      )
    }

    this.value = cleaned
  }

  getValue(): string {
    return this.value
  }

  /**
   * Returns the phone number formatted for display
   * @returns Formatted phone number (e.g., "(11) 98765-4321")
   */
  getFormatted(): string {
    return formatPhoneNumber(this.value)
  }
}
