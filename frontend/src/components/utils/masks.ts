export function maskPhone(value: string) {
  const cleaned = value.replace(/\D/g, '')
  if (!cleaned) return ''
  let formatted = ''
  if (cleaned.length <= 2) {
    formatted = cleaned
  } else if (cleaned.length <= 7) {
    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  } else {
    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(
      2,
      7
    )}-${cleaned.slice(7, 11)}`
  }
  return formatted
}

export function maskCep(value: string) {
  const cleaned = value.replace(/\D/g, '')
  if (!cleaned) return ''
  if (cleaned.length <= 5) return cleaned
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`
}
