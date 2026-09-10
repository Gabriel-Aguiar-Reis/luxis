import { NextRequest, NextResponse } from 'next/server'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookie'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '')

// Calls the backend login server-to-server and re-issues the session token
// as a cookie scoped to this app's own domain. A Set-Cookie for onrender.com
// can never be stored by the browser on a response coming from vercel.app,
// so the token must be extracted and re-set explicitly here.
export async function POST(request: NextRequest) {
  const body = await request.text()

  const backendResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })

  if (!backendResponse.ok) {
    const data = await backendResponse.json().catch(() => undefined)
    return NextResponse.json(data ?? { message: 'Falha na autenticação' }, {
      status: backendResponse.status
    })
  }

  const setCookieHeaders = backendResponse.headers.getSetCookie()
  const authCookieHeader = setCookieHeaders.find((raw) =>
    raw.startsWith(`${AUTH_TOKEN_COOKIE}=`)
  )

  if (!authCookieHeader) {
    return NextResponse.json(
      { message: 'Sessão não pôde ser criada' },
      { status: 502 }
    )
  }

  const token = authCookieHeader
    .split(';')[0]
    .slice(AUTH_TOKEN_COOKIE.length + 1)

  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  return response
}
