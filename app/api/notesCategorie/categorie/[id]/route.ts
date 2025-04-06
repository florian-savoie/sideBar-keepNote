import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Résoudre les paramètres dynamiques
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    console.log("ID from params:", id); // Log pour débogage

    const categorieId = parseInt(id);
    if (isNaN(categorieId)) {
      console.error("Parsed ID is NaN, original ID:", id);
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const note = await prisma.noteGroup.findUnique({
      where: { id: categorieId },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la note:", error);
    return NextResponse.json({
      error: "Failed to fetch note",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}