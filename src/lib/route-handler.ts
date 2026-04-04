import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/core/domain/errors/domain.error";
import { z } from "zod";
import { ApiResponse } from "@/core/dtos/api-response.dto";

type HandlerFunction<T> = (req: NextRequest, ...args: any[]) => Promise<T>;

export function createHandler<T>(handler: HandlerFunction<T>) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      const data = await handler(req, ...args);
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error("API Error:", error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: error.type,
              message: error.message,
            },
          },
          { status: error.statusCode }
        );
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: "VALIDATION_ERROR",
              message: "Dados de entrada inválidos",
              details: error.issues,
            },
          },
          { status: 400 }
        );
      }

      // Default error
      return NextResponse.json(
        {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Um erro inesperado ocorreu",
          },
        },
        { status: 500 }
      );
    }
  };
}
