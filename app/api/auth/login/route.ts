// /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({ 
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}