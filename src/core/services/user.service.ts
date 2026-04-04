import { prisma } from "@/lib/prisma";
import { CreateUserDTO } from "../dtos/user.dto";
import { AppError } from "../domain/errors/domain.error";
import { hash, compare } from "bcrypt";

export class UserService {
    async register(data: CreateUserDTO) {
        const exists = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (exists) {
            throw new AppError("Email já cadastrado", 409);
        }

        const hashedPassword = await hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                category: data.category || null,
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

        return user;
    }

    async validateCredentials(email: string, password: string) {
        if (!email || !password) {
            throw new AppError("Email e senha são obrigatórios", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
            return null;
        }

        // Retorna usuário sem a senha
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
