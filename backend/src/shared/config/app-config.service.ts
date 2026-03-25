import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

type NodeEnv = 'development' | 'test' | 'production' | 'spec'
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  getPort(): number {
    return this.config.get<number>('PORT', 3000)
  }

  getNodeEnv(): NodeEnv {
    return this.config.get<NodeEnv>('NODE_ENV', 'development')
  }

  getDatabaseUrl(): string | undefined {
    return this.config.get<string>('DATABASE_URL')
  }

  isProduction(): boolean {
    return this.getNodeEnv() === 'production'
  }

  isTest(): boolean {
    return this.getNodeEnv() === 'test'
  }

  getJwtSecret(): string {
    const secret = this.config.get<string>('JWT_SECRET')
    if (!secret) {
      throw new BadRequestException(
        'JWT_SECRET is not defined in environment variables'
      )
    }
    return secret
  }

  getJwtExpirationTime(): string | undefined {
    return this.config.get<string>('JWT_EXPIRATION_TIME')
  }

  getAuthCookieName(): string {
    return this.config.get<string>('AUTH_COOKIE_NAME', 'luxis_auth_token')
  }

  getLogRules(): string | undefined {
    return this.config.get<string>('LOG_RULES')
  }

  getLogLevel(): LogLevel {
    const level = this.config.get<LogLevel>('LOG_LEVEL')

    if (level) {
      return level
    }

    if (this.isProduction()) {
      return 'warn'
    }

    if (this.isTest()) {
      return 'error'
    }

    return 'debug'
  }

  getCorsOrigins(): string[] {
    const rawOrigins = this.config.get<string>('CORS_ORIGINS')

    if (!rawOrigins || rawOrigins.trim() === '') {
      if (this.isProduction()) {
        throw new BadRequestException(
          'CORS_ORIGINS must be defined in production environment variables'
        )
      }

      return ['http://localhost:3001', 'http://127.0.0.1:3001']
    }

    return rawOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  }

  getThrottleTtl(): number {
    return this.config.get<number>('THROTTLE_TTL', 10000)
  }

  getThrottleLimit(): number {
    return this.config.get<number>('THROTTLE_LIMIT', 10)
  }

  getCacheTtl(): number {
    return this.config.get<number>('CACHE_TTL', 60000)
  }

  getCacheMax(): number {
    return this.config.get<number>('CACHE_MAX', 100)
  }

  getCloudinaryCloudName(): string | undefined {
    return this.config.get<string>('CLOUDINARY_CLOUD_NAME')
  }

  getCloudinaryApiKey(): string | undefined {
    return this.config.get<string>('CLOUDINARY_API_KEY')
  }

  getCloudinaryApiSecret(): string | undefined {
    return this.config.get<string>('CLOUDINARY_API_SECRET')
  }

  getDatabaseHost(): string | undefined {
    return this.config.get<string>('DB_HOST')
  }

  getDatabasePort(): number | undefined {
    return this.config.get<number>('DB_PORT')
  }

  getDatabaseUser(): string | undefined {
    return this.config.get<string>('DB_USER')
  }

  getDatabasePassword(): string | undefined {
    return this.config.get<string>('DB_PASSWORD')
  }

  getDatabaseName(): string | undefined {
    return this.config.get<string>('DB_NAME')
  }

  getSuperuserEmail(): string | undefined {
    return this.config.get<string>('SUPERUSER_EMAIL')
  }

  getSuperuserPassword(): string | undefined {
    return this.config.get<string>('SUPERUSER_PASSWORD')
  }

  getSuperuserPhone(): string | undefined {
    return this.config.get<string>('SUPERUSER_PHONE')
  }

  getSuperuserStreet(): string | undefined {
    return this.config.get<string>('SUPERUSER_STREET')
  }

  getSuperuserNumber(): string | undefined {
    return this.config.get<string>('SUPERUSER_NUMBER')
  }

  getSuperuserComplement(): string | undefined {
    return this.config.get<string>('SUPERUSER_COMPLEMENT')
  }

  getSuperuserNeighborhood(): string | undefined {
    return this.config.get<string>('SUPERUSER_NEIGHBORHOOD')
  }

  getSuperuserCity(): string | undefined {
    return this.config.get<string>('SUPERUSER_CITY')
  }

  getSuperuserState(): string | undefined {
    return this.config.get<string>('SUPERUSER_STATE')
  }

  getSuperuserZipCode(): string | undefined {
    return this.config.get<string>('SUPERUSER_ZIPCODE')
  }

  getSuperuserName(): string | undefined {
    return this.config.get<string>('SUPERUSER_NAME')
  }

  getSuperuserSurName(): string | undefined {
    return this.config.get<string>('SUPERUSER_SURNAME')
  }

  getEmailResetPasswordUrl(): string | undefined {
    return this.config.get<string>('EMAIL_RESET_PASSWORD_URL')
  }

  getMailersendApiKey(): string | undefined {
    return this.config.get<string>('MAILERSEND_API_KEY')
  }

  getEmailFrom(): string | undefined {
    return this.config.get<string>('EMAIL_FROM')
  }
}
