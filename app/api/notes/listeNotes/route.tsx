import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer toutes les notes de la base de données
        const notes = await prisma.note.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        
        // Retourner les notes en réponse JSON
        return NextResponse.json({ notes }, { status: 200 });
    } catch (error) {
        // Gestion des erreurs
        console.error('Erreur lors de la récupération des notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    } finally {
        // Déconnexion de la base de données
        await prisma.$disconnect();
    }
}