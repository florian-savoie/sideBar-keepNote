// pages/api/PostBlock.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // On suppose que Prisma est utilisé pour la base de données
import { getSession } from "@/lib/auth"; // Fonction pour récupérer la session de l'utilisateur connecté

export async function POST(request: NextRequest) {
  // Récupérer la session pour vérifier l'utilisateur connecté
  const session = await getSession();
  
  if (!session?.userId) {
    return NextResponse.json({ authenticated: false, message: "Non autorisé" }, { status: 401 });
  }

  // Extraire les données du corps de la requête (pour créer un NoteGroup)
  const { title } = await request.json();

  // Vérifier que le titre est présent
  if (!title) {
    return NextResponse.json({ message: "Le titre est requis" }, { status: 400 });
  }

  // Créer un NoteGroup pour l'utilisateur connecté
  try {
    const newNoteGroup = await prisma.noteGroup.create({
      data: {
        title,
        userId: session.userId, // Lier le NoteGroup à l'utilisateur
      },
    });

    return NextResponse.json({ message: "NoteGroup ajouté avec succès", noteGroup: newNoteGroup }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du NoteGroup:", error);
    return NextResponse.json({ message: "Erreur lors de l'ajout du NoteGroup" }, { status: 500 });
  }
}
