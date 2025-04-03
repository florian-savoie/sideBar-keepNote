import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = context.params; // Déstructurer params
        console.log("Valeur brute de id :", id);
        const categorieId = parseInt(id);
        console.log("Valeur convertie de categorieId :", categorieId);

        if (isNaN(categorieId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
        return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
    }
}