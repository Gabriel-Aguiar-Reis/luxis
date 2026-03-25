export const AUTH_TOKEN_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ??
  process.env.AUTH_COOKIE_NAME ??
  'luxis_auth_token'
