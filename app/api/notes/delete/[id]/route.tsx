import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Export nommé pour DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Récupérer la session
  const session = await getSession();
  console.log("session", session);

  // Vérifier si l'utilisateur est authentifié
  if (!session?.userId) {
    return NextResponse.json({ authenticated: false, message: "Non autorisé" }, { status: 401 });
  }

  // Accéder à params.id directement (pas besoin d'await ici)
  const noteId = parseInt(params.id);

  // Vérifier si la note existe et appartient à l'utilisateur
  const existingNote = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!existingNote) {
    return NextResponse.json({ message: "Note introuvable" }, { status: 404 });
  }

  if (existingNote.userId !== session.userId) {
    return NextResponse.json({ message: "Vous n'êtes pas autorisé à supprimer cette note" }, { status: 403 });
  }

  // Supprimer la note
  await prisma.note.delete({
    where: { id: noteId },
  });

  return NextResponse.json({ message: "Note supprimée avec succès" }, { status: 200 });
}
