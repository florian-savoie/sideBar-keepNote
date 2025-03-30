import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get all notes from database
        const notes = await prisma.note.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log('notesnotesnotes', notes); // Log the fetched notes
        // Return notes as JSON response
        return NextResponse.json({ notes }, { status: 200 });
    } catch (error) {
        // Handle any errors
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    } finally {
        // Disconnect from database
        await prisma.$disconnect();
    }
}
