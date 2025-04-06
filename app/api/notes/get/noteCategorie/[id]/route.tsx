import { NextRequest, NextResponse } from "next/server"; 
import { prisma } from '@/lib/prisma'; 
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  // Get session
  const session = await getSession();
  console.log("session", session);

  // Check authentication
  if (!session?.userId) {
    return NextResponse.json(
      { authenticated: false, message: "Non autorisé" }, 
      { status: 401 }
    );
  }

  // Parse the ID parameter
  const categoryId = parseInt(params.id);
  
  if (isNaN(categoryId)) {
    return NextResponse.json(
      { message: "ID de catégorie invalide" }, 
      { status: 400 }
    );
  }

  try {
    // Check if the category exists and belongs to the user
    const category = await prisma.noteGroup.findFirst({
      where: {
        id: categoryId,
        userId: session.userId
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Catégorie introuvable ou non autorisée" }, 
        { status: 404 }
      );
    }

    // Get all notes in this category
    const notes = await prisma.note.findMany({
      where: {
        noteGroupId: categoryId,
        userId: session.userId
      },
    });

    // Return both category and notes
    return NextResponse.json({ 
      category, 
      notes 
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: String(error) }, 
      { status: 500 }
    );
  }
}