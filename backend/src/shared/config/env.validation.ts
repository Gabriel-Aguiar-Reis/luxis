import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url().optional(),
  PORT: z.string().transform(Number).default('3000'),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRATION_TIME: z.string().optional(),
  LOG_RULES: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().transform(Number).optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
  SUPERUSER_NAME: z.string().optional(),
  SUPERUSER_SURNAME: z.string().optional(),
  SUPERUSER_EMAIL: z.string().email().optional(),
  SUPERUSER_PASSWORD: z.string().optional(),
  SUPERUSER_PHONE: z.string().optional()
})

export type EnvVars = z.infer<typeof envSchema>

export function validateEnv(raw: Record<string, unknown>): EnvVars {
  const parsed = envSchema.safeParse(raw)

  if (!parsed.success) {
    console.error('[❌] Invalid environment variables:')
    console.error(parsed.error.format())
    process.exit(1)
  }

  return parsed.data
}
