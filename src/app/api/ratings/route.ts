import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RatingService } from "@/core/services/rating.service";
import { createRatingSchema } from "@/core/dtos/rating.dto";

const ratingService = new RatingService();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createRatingSchema.parse(body);

    const rating = await ratingService.create(session.user.id, validatedData);
    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API de avaliações:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar avaliação" },
      { status: error.statusCode || 500 }
    );
  }
}
