import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: "Token necessário" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  
  
  if (token !== 'test123') {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  return NextResponse.json({ 
    message: "Chat funcionando!",
    user: "Usuário Teste",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: "Token necessário" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  
  if (token !== 'test123') {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const body = await request.json();
  
  return NextResponse.json({
    message: "Mensagem recebida",
    data: body,
    timestamp: new Date().toISOString()
  });
}