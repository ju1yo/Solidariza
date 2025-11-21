import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: "ID da conversa é obrigatório" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { name: true, foto_perfil: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.message,
      read: msg.read,
      createdAt: msg.createdAt,
      senderName: msg.sender.name,
      senderPhoto: msg.sender.foto_perfil,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}