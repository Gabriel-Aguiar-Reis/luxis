import { NextResponse } from 'next/server'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookie'

// Only clears the frontend's own session cookie. The backend's JWT is
// stateless, so there is nothing to revoke server-side.
export async function POST() {
  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })

  return response
}
