import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { AppError } from "../domain/errors/domain.error";

export class UploadService {
    async uploadFile(file: File): Promise<string> {
        if (!file) {
            throw new AppError("Nenhum arquivo enviado", 400);
        }

        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public/uploads");

            await mkdir(uploadDir, { recursive: true });

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, '_')}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);

            return `/uploads/${filename}`;
        } catch (error) {
            console.error("Erro no UploadService:", error);
            throw new AppError("Falha ao processar upload", 500);
        }
    }
}
