import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; // On suppose que Prisma est utilisé pour la base de données
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Récupérer la session pour vérifier l'utilisateur connecté
  const session = await getSession();
  console.log("session", session);

  // Vérifier si l'utilisateur est authentifié
  if (!session?.userId) {
    return NextResponse.json({ authenticated: false, message: "Non autorisé" }, { status: 401 });
  }

  const noteId = parseInt(params.id);

  // Vérifier si la note existe
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    return NextResponse.json({ message: "Note introuvable" }, { status: 404 });
  }

  // Vérifier si la note appartient à l'utilisateur
  if (note.userId !== session.userId) {
    return NextResponse.json({ message: "Vous n'êtes pas autorisé à accéder à cette note" }, { status: 403 });
  }

  // Retourner la note trouvée
  return NextResponse.json({ message: "Note récupérée avec succès", note }, { status: 200 });
}