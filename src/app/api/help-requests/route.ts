import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, location, items, customItemsDescription, helpType, imageUrl } = body;
    if (!title || !description || !location || !helpType || !items) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        title,
        description,
        location,
        items,
        customItemsDescription,
        helpType,
        imageUrl,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(helpRequest, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar solicitação de ajuda:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}