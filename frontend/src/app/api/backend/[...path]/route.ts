import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookie'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '')

type RouteParams = { params: Promise<{ path: string[] }> }

// Forwards browser requests to the backend, attaching the session token read
// from this app's own httpOnly cookie as a Bearer header. This keeps the real
// session cookie scoped to the frontend's domain so middleware can read it,
// while the backend never has to be on the same site as the frontend.
async function proxy(request: NextRequest, { params }: RouteParams) {
  const { path } = await params
  const targetPath = `/${path.join('/')}`
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  const body = ['GET', 'HEAD'].includes(request.method)
    ? undefined
    : await request.text()
  const headers: Record<string, string> = {}
  const contentType = request.headers.get('content-type')

  if (body && contentType) {
    headers['Content-Type'] = contentType
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const backendResponse = await fetch(
    `${API_URL}${targetPath}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body
    }
  )

  if (backendResponse.status === 204 || backendResponse.status === 304) {
    return new NextResponse(null, { status: backendResponse.status })
  }

  const responseBody = await backendResponse.arrayBuffer()

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      'content-type':
        backendResponse.headers.get('content-type') ?? 'application/json'
    }
  })
}

export async function GET(request: NextRequest, context: RouteParams) {
  return proxy(request, context)
}

export async function POST(request: NextRequest, context: RouteParams) {
  return proxy(request, context)
}

export async function PUT(request: NextRequest, context: RouteParams) {
  return proxy(request, context)
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  return proxy(request, context)
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  return proxy(request, context)
}
