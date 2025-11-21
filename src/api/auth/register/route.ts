import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, category } = body;

    // ---------------------------
    // 🔍 1. Validações básicas
    // ---------------------------
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados obrigatórios ausentes",
          required: ["name", "email", "password", "role"],
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "A senha deve ter no mínimo 6 caracteres",
        },
        { status: 400 }
      );
    }

    // ---------------------------
    // 📌 2. Verificar se já existe
    // ---------------------------
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email já cadastrado",
        },
        { status: 409 }
      );
    }

    // ---------------------------
    // 🔐 3. Criptografar Senha
    // ---------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------------
    // 📝 4. Criar usuário
    // ---------------------------
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        category: category || null, // categoria opcional
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        category: true,
        createdAt: true,
      },
    });

    // ---------------------------
    // 🎉 5. Resposta final
    // ---------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Conta criada com sucesso",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro no REGISTER:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno no servidor",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
