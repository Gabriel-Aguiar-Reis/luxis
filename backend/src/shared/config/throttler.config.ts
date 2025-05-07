import { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttlerConfig = (): ThrottlerModuleOptions => [
  {
    ttl: 60 * 1000,
    limit: 10
  }
]
