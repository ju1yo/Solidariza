import { NextResponse } from "next/server";
import { UserService } from "@/core/services/user.service";
import { createUserSchema } from "@/core/dtos/user.dto";
import { AppError } from "@/core/domain/errors/domain.error";
import { z } from "zod";

const userService = new UserService();

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validation
        const data = createUserSchema.parse(body);

        // 2. Service Call
        const user = await userService.register(data);

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

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Dados inválidos",
                    errors: error.issues,
                },
                { status: 400 }
            );
        }

        if (error instanceof AppError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: error.statusCode }
            );
        }

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
