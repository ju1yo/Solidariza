import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UploadService } from "@/core/services/upload.service";
import { AppError } from "@/core/domain/errors/domain.error";

const uploadService = new UploadService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    const url = await uploadService.uploadFile(file);

    return NextResponse.json({ success: true, url });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: "Erro interno do servidor." }, { status: 500 });
  }
}