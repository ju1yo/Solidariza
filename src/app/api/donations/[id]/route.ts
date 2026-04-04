import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DonationService } from "@/core/services/donation.service";
import { updateDonationStatusSchema } from "@/core/dtos/donation.dto";

const donationService = new DonationService();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = updateDonationStatusSchema.parse(body);

    let donation;
    if (status === "aceito") {
      donation = await donationService.accept(params.id, session.user.id);
    } else if (status === "entregue") {
      donation = await donationService.markDelivered(params.id, session.user.id);
    } else if (status === "cancelado") {
      donation = await donationService.cancel(params.id, session.user.id);
    } else {
      return NextResponse.json({ error: "Status inválido para esta rota" }, { status: 400 });
    }

    return NextResponse.json(donation);
  } catch (error: any) {
    console.error("Erro ao atualizar doação:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar doação" },
      { status: error.statusCode || 500 }
    );
  }
}
