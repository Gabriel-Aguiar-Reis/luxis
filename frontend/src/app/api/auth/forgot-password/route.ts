import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const response = await fetch(
      'https://api.luxis.com.br/auth/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao solicitar recuperação de senha')
    }

    return NextResponse.json(
      { message: 'Solicitação criada. Aguarde a aprovação do administrador.' },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      'Erro ao processar solicitação de recuperação de senha:',
      error
    )
    return NextResponse.json(
      { message: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
