import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const noteGroups = await prisma.noteGroup.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedNoteGroups = noteGroups.map((group) => ({
      id: group.id,
      name: group.title, // Changé de 'title' à 'name' pour correspondre à SelectTypeHead
    }));

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