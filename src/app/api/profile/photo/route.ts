
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('photo') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(path, buffer);

    const photoUrl = `/uploads/${filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { profileImage: photoUrl },
    });

    return NextResponse.json({
      success: true,
      message: 'Foto atualizada com sucesso!',
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload da foto' }, { status: 500 });
  }
}
