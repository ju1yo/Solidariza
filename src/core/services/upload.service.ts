import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { AppError } from "../domain/errors/domain.error";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class UploadService {
    async uploadFile(file: File): Promise<string> {
        if (!file) {
            throw new AppError("Nenhum arquivo enviado", 400);
        }

        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            throw new AppError(
                "Tipo de arquivo não permitido. Use: JPEG, PNG, WebP ou GIF.",
                400
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw new AppError("Arquivo muito grande. Tamanho máximo: 5MB.", 400);
        }

        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public/uploads");

            await mkdir(uploadDir, { recursive: true });

            // Sanitize filename — remove path traversal and special chars
            const safeName = file.name
                .replace(/\.\./g, "")
                .replace(/[^a-zA-Z0-9._-]/g, "_");
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const filename = `${uniqueSuffix}-${safeName}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);

            return `/uploads/${filename}`;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error("Erro no UploadService:", error);
            throw new AppError("Falha ao processar upload", 500);
        }
    }
}
