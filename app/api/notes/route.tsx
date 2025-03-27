import { NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import mime from "mime";
import { prisma } from "@/lib/prisma"; // Adjust the import path as needed

// 🛠️ Schéma de validation avec Zod
const noteSchema = z.object({
  title: z.string().min(3, "Le titre est trop court"),
  description: z.string().min(10, "La description est trop courte"),
  creator: z.string().min(3, "Le pseudo du créateur est requis"),
  imageUrl: z.string().url().optional(),
});

// 📌 Gestion de la requête POST
export async function POST(req: Request) {
  console.log("📩 Réception de la requête POST /api/notes");

  try {
    // Capture full request details for debugging
    const formData = await req.formData();
    console.log("✅ FormData récupéré :", Object.fromEntries(formData));

    // Extract data from formData
    const title = formData.get("title");
    const description = formData.get("description");
    const creator = formData.get("creator");
    const imageUrl = formData.get("imageUrl") as string | undefined;
    const imageFile = formData.get("imageFile") as File | null;

    console.log("🛠️ Données extraites :", { 
      title, 
      description, 
      creator, 
      imageUrl, 
      imageHasFile: !!imageFile 
    });

    // Validate data
    const parsedData = noteSchema.safeParse({ 
      title, 
      description, 
      creator, 
      imageUrl 
    });

    if (!parsedData.success) {
      console.error("❌ Erreur de validation :", parsedData.error.format());
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }
    console.log("✅ Données validées avec succès");

    // Handle image
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
    } else if (imageUrl) {
      imageType = "url";
      savedImagePath = imageUrl;
      console.log("🌍 Utilisation d'une image externe :", imageUrl);
    }

    // Debugging: Check Prisma client
    console.log("🔍 Vérification du client Prisma...");
    console.log("Prisma client exists:", !!prisma);
    console.log("Prisma.note exists:", !!prisma?.note);

    // Enregistrer la note
    console.log("📝 Enregistrement de la note en base de données...");

    const newNote = await prisma.note.create({
      data: {
        title: title as string,
        description: description as string,
        userId: 1, // Hardcoded user ID for testing
        creatorPseudo: creator as string,
        pathImage: savedImagePath,
        pathType: imageType,
      },
    });

    console.log("✅ Note enregistrée avec succès :", newNote);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur détaillée :", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: "Erreur interne du serveur", 
        message: error.message,
        stack: error.stack 
      }, { status: 500 });
    }

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}