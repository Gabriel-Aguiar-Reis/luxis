import { UUID } from 'crypto'

export function parsePgUuidArray(arrayStr: string): UUID[] {
  return arrayStr.replace(/^{|}$/g, '').split(',').filter(Boolean) as UUID[]
}
