import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

type NodeEnv = 'development' | 'test' | 'production'

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

  getLogRules(): string | undefined {
    return this.config.get<string>('LOG_RULES')
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

  getEmailUser(): string | undefined {
    return this.config.get<string>('EMAIL_USER')
  }

  getEmailPassword(): string | undefined {
    return this.config.get<string>('EMAIL_PASSWORD')
  }

  getEmailHost(): string | undefined {
    return this.config.get<string>('EMAIL_HOST')
  }

  getEmailPort(): number | undefined {
    return this.config.get<number>('EMAIL_PORT')
  }

  getEmailResetPasswordUrl(): string | undefined {
    return this.config.get<string>('EMAIL_RESET_PASSWORD_URL')
  }
}
