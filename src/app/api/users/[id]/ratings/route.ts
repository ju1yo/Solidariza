import { NextRequest, NextResponse } from "next/server";
import { RatingService } from "@/core/services/rating.service";

const ratingService = new RatingService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ratings = await ratingService.listByUser(params.id);
    const summary = await ratingService.getAverageForUser(params.id);

    return NextResponse.json({ ratings, summary });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar avaliações" },
      { status: 500 }
    );
  }
}
