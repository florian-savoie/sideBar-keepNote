import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const categorieId =  parseInt(params.id);

        // Vérification de l'ID
        if (isNaN(categorieId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Récupération de la note
        const note = await prisma.noteGroup.findUnique({
            where: { 
                id: categorieId 
            }
        });

        // Vérification si la note existe
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
    // Pas besoin de finally avec $disconnect dans les versions récentes de Prisma
}