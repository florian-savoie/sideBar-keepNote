// app/api/noteGroups/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth"; // Assurez-vous que cette fonction existe

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();

  // Vérifier la session avant de continuer
  if (!session?.userId) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    // Récupérer les noteGroups avec leurs notes associées pour l'utilisateur connecté
    const noteGroups = await prisma.noteGroup.findMany({
      where: {
        userId: session.userId, // Filtrer par utilisateur connecté
      },
      include: {
        notes: true, // Inclure les notes liées à chaque noteGroup
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formater les données pour la sidebar
    const formattedNoteGroups = noteGroups.map((group) => ({
      id: group.id,
      title: group.title,
      notes: group.notes.map((note) => ({
        id: note.id,
        title: note.title,
        url: `/notes/${note.id}`, // URL personnalisée pour chaque note
        description: note.description,
        pathImage: note.pathImage,
        pathType: note.pathType,
      })),
    }));

    // Retourner la réponse avec NextResponse
    return NextResponse.json({ noteGroups: formattedNoteGroups }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des noteGroups:", error);
    return NextResponse.json(
      { error: "Failed to fetch noteGroups" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}