// /app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Vérifier que le Content-Type est bien JSON
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { message: "Requête invalide, JSON attendu" },
        { status: 400 }
      );
    }

    // Vérifier que le corps existe avant de parser
    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { message: "Corps de la requête vide" },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { message: "Format JSON invalide" },
        { status: 400 }
      );
    }

    const { pseudo, email, password } = data;
    console.log("📩 Données reçues :", pseudo, email, password);

    // Validation
    if (!email || !password || !pseudo) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation supplémentaire pour l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    console.log("Vérification si l'email existe...");
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Validation du mot de passe (longueur minimale côté serveur)
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Hachage du mot de passe
    console.log("Début du hachage du mot de passe...");
    const hashedPassword = await hashPassword(password);
    console.log("Mot de passe haché :", hashedPassword);

    // Création de l'utilisateur
    console.log("Création de l'utilisateur...");
    const user = await prisma.user.create({
      data: {
        pseudo,
        email,
        password: hashedPassword
      }
    });
    console.log("Utilisateur créé :", user);

    return NextResponse.json({
      message: "Inscription réussie",
      user: {
        id: String(user.id),
        email: user.email,
        pseudo: user.pseudo
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}