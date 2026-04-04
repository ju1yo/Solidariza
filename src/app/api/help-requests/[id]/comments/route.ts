import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommentService } from "@/core/services/comment.service";

const commentService = new CommentService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comments = await commentService.listByHelpRequest(params.id);
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Conteúdo é obrigatório" }, { status: 400 });
    }

    const comment = await commentService.create(session.user.id, params.id, content);
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API de comentários:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar comentário" },
      { status: error.statusCode || 500 }
    );
  }
}
