import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Export nommé pour PUT
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    return NextResponse.json({ message: "Vous n'êtes pas autorisé à modifier cette note" }, { status: 403 });
  }

  // Récupérer les données du corps de la requête
  const { title, description, pathType, pathImage } = await request.json();

  // Vérifier les champs obligatoires
  if (!title || !description || !pathType) {
    return NextResponse.json({ message: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
  }

  // Mettre à jour la note
  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      title,
      description,
      pathType,
      pathImage: pathImage || null,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Note mise à jour avec succès", note: updatedNote }, { status: 200 });
}