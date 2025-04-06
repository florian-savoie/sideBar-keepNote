import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Récupérer la session utilisateur
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ authenticated: false, message: "Non autorisé" }, { status: 401 });
  }

  try {
    // Récupérer les données du body
    const { title } = await request.json();

    // Validation simple
    if (!title || title.trim() === "") {
      return NextResponse.json({ message: "Le titre est requis" }, { status: 400 });
    }

    // Création dans la BDD
    const createdNoteGroup = await prisma.noteGroup.create({
      data: {
        title,
        userId: session.userId,
      },
    });

    return NextResponse.json(
        { 
          message: "Catégorie créée avec succès", 
          noteGroup: createdNoteGroup 
        },
        { status: 201 }
      );
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la création", error },
      { status: 500 }
    );
  }
}
