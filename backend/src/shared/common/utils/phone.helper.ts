/**
 * Utility functions for handling phone numbers
 * These functions are flexible and handle various phone number formats
 */

/**
 * Removes all non-numeric characters from a phone number
 * @param phone - Phone number in any format
 * @returns Phone number with only digits
 * @example
 * cleanPhoneNumber('(11) 98765-4321') // '11987654321'
 * cleanPhoneNumber('+55 11 9 8765-4321') // '5511987654321'
 * cleanPhoneNumber('11987654321') // '11987654321'
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Validates if a cleaned phone number has a valid length for Brazilian phones
 * Accepts: 10 digits (landline) or 11 digits (mobile)
 * Can optionally include country code (+55)
 * @param cleanedPhone - Phone number with only digits
 * @returns true if valid length, false otherwise
 */
export function isValidPhoneLength(cleanedPhone: string): boolean {
  const length = cleanedPhone.length
  // 10 digits: landline (11) 3456-7890
  // 11 digits: mobile (11) 98765-4321
  // 12 digits: landline with country code 55 11 3456-7890
  // 13 digits: mobile with country code 55 11 98765-4321
  return length === 10 || length === 11 || length === 12 || length === 13
}

/**
 * Formats a cleaned phone number for display
 * @param cleanedPhone - Phone number with only digits
 * @returns Formatted phone number
 * @example
 * formatPhoneNumber('11987654321') // '(11) 98765-4321'
 * formatPhoneNumber('1134567890') // '(11) 3456-7890'
 * formatPhoneNumber('5511987654321') // '+55 (11) 98765-4321'
 */
export function formatPhoneNumber(cleanedPhone: string): string {
  // Remove country code if present for formatting
  let phone = cleanedPhone
  let countryCode = ''

  if (phone.startsWith('55') && phone.length >= 12) {
    countryCode = '+55 '
    phone = phone.substring(2)
  }

  // Format based on length
  if (phone.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `${countryCode}(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`
  } else if (phone.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `${countryCode}(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`
  }

  // Return as-is if format is not recognized
  return cleanedPhone
}

/**
 * Normalizes and validates a phone number
 * Cleans the input and checks if it's valid
 * @param phone - Phone number in any format
 * @returns Object with cleaned phone and validity status
 */
export function normalizePhoneNumber(phone: string): {
  cleaned: string
  isValid: boolean
  formatted: string
} {
  const cleaned = cleanPhoneNumber(phone)
  const isValid = isValidPhoneLength(cleaned)
  const formatted = isValid ? formatPhoneNumber(cleaned) : cleaned

  return { cleaned, isValid, formatted }
}
