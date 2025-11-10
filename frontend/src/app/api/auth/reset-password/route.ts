import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const response = await fetch(
      'http://localhost:3000/api/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao redefinir senha')
    }

    return NextResponse.json(
      { message: 'Senha redefinida com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao processar redefinição de senha:', error)
    return NextResponse.json(
      { message: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
