import {
  cleanPhoneNumber,
  isValidPhoneLength,
  formatPhoneNumber,
  normalizePhoneNumber
} from '@/shared/common/utils/phone.helper'

describe('Phone Helper', () => {
  describe('cleanPhoneNumber', () => {
    it('should remove all non-numeric characters', () => {
      expect(cleanPhoneNumber('(11) 98765-4321')).toBe('11987654321')
      expect(cleanPhoneNumber('11 98765-4321')).toBe('11987654321')
      expect(cleanPhoneNumber('+55 11 98765-4321')).toBe('5511987654321')
      expect(cleanPhoneNumber('11987654321')).toBe('11987654321')
      expect(cleanPhoneNumber('(11) 3456-7890')).toBe('1134567890')
      expect(cleanPhoneNumber('+55 (11) 9 8765-4321')).toBe('5511987654321')
    })

    it('should handle edge cases', () => {
      expect(cleanPhoneNumber('')).toBe('')
      expect(cleanPhoneNumber('abc')).toBe('')
      expect(cleanPhoneNumber('11-98765-4321')).toBe('11987654321')
    })
  })

  describe('isValidPhoneLength', () => {
    it('should accept valid Brazilian phone lengths', () => {
      expect(isValidPhoneLength('1134567890')).toBe(true) // 10 digits - landline
      expect(isValidPhoneLength('11987654321')).toBe(true) // 11 digits - mobile
      expect(isValidPhoneLength('551134567890')).toBe(true) // 12 digits - landline with country code
      expect(isValidPhoneLength('5511987654321')).toBe(true) // 13 digits - mobile with country code
    })

    it('should reject invalid lengths', () => {
      expect(isValidPhoneLength('123456789')).toBe(false) // 9 digits
      expect(isValidPhoneLength('123456')).toBe(false) // 6 digits
      expect(isValidPhoneLength('12345678901234')).toBe(false) // 14 digits
      expect(isValidPhoneLength('')).toBe(false) // empty
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format mobile numbers (11 digits)', () => {
      expect(formatPhoneNumber('11987654321')).toBe('(11) 98765-4321')
      expect(formatPhoneNumber('21987654321')).toBe('(21) 98765-4321')
    })

    it('should format landline numbers (10 digits)', () => {
      expect(formatPhoneNumber('1134567890')).toBe('(11) 3456-7890')
      expect(formatPhoneNumber('2134567890')).toBe('(21) 3456-7890')
    })

    it('should format numbers with country code', () => {
      expect(formatPhoneNumber('5511987654321')).toBe('+55 (11) 98765-4321')
      expect(formatPhoneNumber('551134567890')).toBe('+55 (11) 3456-7890')
    })

    it('should return as-is for unrecognized formats', () => {
      expect(formatPhoneNumber('123456789')).toBe('123456789')
      expect(formatPhoneNumber('')).toBe('')
    })
  })

  describe('normalizePhoneNumber', () => {
    it('should normalize and validate valid phone numbers', () => {
      const result1 = normalizePhoneNumber('(11) 98765-4321')
      expect(result1.cleaned).toBe('11987654321')
      expect(result1.isValid).toBe(true)
      expect(result1.formatted).toBe('(11) 98765-4321')

      const result2 = normalizePhoneNumber('+55 11 3456-7890')
      expect(result2.cleaned).toBe('551134567890')
      expect(result2.isValid).toBe(true)
      expect(result2.formatted).toBe('+55 (11) 3456-7890')
    })

    it('should handle invalid phone numbers', () => {
      const result = normalizePhoneNumber('123')
      expect(result.cleaned).toBe('123')
      expect(result.isValid).toBe(false)
      expect(result.formatted).toBe('123')
    })

    it('should handle various formats', () => {
      const formats = [
        '(11) 98765-4321',
        '11 98765-4321',
        '11-98765-4321',
        '11987654321',
        '+55 11 98765-4321',
        '5511987654321'
      ]

      formats.forEach((format) => {
        const result = normalizePhoneNumber(format)
        expect(result.isValid).toBe(true)
      })
    })
  })
})
