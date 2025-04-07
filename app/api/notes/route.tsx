import { NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import mime from "mime";
import { prisma } from "@/lib/prisma";
import { getSession } from '@/lib/auth';

// 🛠️ Schéma de validation avec Zod
const noteSchema = z.object({
  title: z.string().min(3, "Le titre est trop court"),
  description: z.string().min(10, "La description est trop courte"),
  imageUrl: z.string().url().optional(),
  noteGroupId: z.coerce.number().int("L'identifiant du groupe est requis"),
});

// 📌 Gestion de la requête POST
export async function POST(req: Request) {
  const session = await getSession();

  // Vérifier si l'utilisateur est authentifié
  if (!session?.userId && !session?.pseudo) {
    return NextResponse.json({ authenticated: false, message: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    console.log("✅ FormData récupéré :", Object.fromEntries(formData));

    // Extraction des données depuis formData
    const title = formData.get("title");
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl") as string | undefined;
    const imageFile = formData.get("imageFile") as File | null;
    const noteGroupId = formData.get("noteGroupId");

    console.log("🛠️ Données extraites :", { 
      title, 
      description, 
      imageUrl, 
      imageHasFile: !!imageFile,
      noteGroupId,
    });

    // Validation des données
    const parsedData = noteSchema.safeParse({ 
      title, 
      description, 
      imageUrl,
      noteGroupId,
    });

    if (!parsedData.success) {
      console.error("❌ Erreur de validation :", parsedData.error.format());
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const {
      title: validTitle,
      description: validDescription,
      imageUrl: validImageUrl,
      noteGroupId: validNoteGroupId,
    } = parsedData.data;

    console.log("✅ Données validées avec succès");

    // Traitement de l'image
    let savedImagePath: string | null = null;
    let imageType: string = "none";

    if (imageFile && imageFile.size > 0) {
      console.log("📷 Image fichier détectée, enregistrement en cours...");
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = mime.getExtension(imageFile.type) || "jpg";
      const fileName = `note_${Date.now()}.${ext}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      savedImagePath = `/uploads/${fileName}`;
      imageType = "local";
    } else if (validImageUrl) {
      imageType = "url";
      savedImagePath = validImageUrl;
      console.log("🌍 Utilisation d'une image externe :", validImageUrl);
    }

    // Enregistrement dans la base de données
    console.log("📝 Enregistrement de la note en base de données...");
    const newNote = await prisma.note.create({
      data: {
        title: validTitle,
        description: validDescription,
        userId: session.userId, // 🧪 À remplacer plus tard par l'ID dynamique de l'utilisateur connecté
        creatorPseudo: session.pseudo,
        pathImage: savedImagePath,
        pathType: imageType,
        noteGroupId: validNoteGroupId,
      },
    });

    console.log("✅ Note enregistrée avec succès :", newNote);
    return NextResponse.json(newNote, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur détaillée :", error);

    if (error instanceof Error) {
      return NextResponse.json({
        error: "Erreur interne du serveur",
        message: error.message,
        stack: error.stack,
      }, { status: 500 });
    }

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
