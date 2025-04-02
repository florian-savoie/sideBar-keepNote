"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 🛠️ Schéma de validation avec Zod
const noteSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères")
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function PostBlock() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const onSubmit = async (data: NoteFormData) => { // Utilise NoteFormData ici
    try {
      const response = await fetch("/api/PostBlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Définir le type de contenu comme JSON
        },
        body: JSON.stringify(data), // Convertir les données en JSON
      });

      if (response.ok) {
        alert("NoteGroup ajouté avec succès !");
      } else {
        alert("Erreur lors de l'ajout du NoteGroup");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
            {/* Title Input */}
            <div>
              <Label htmlFor="title">Titre du block</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Titre de la note"
                className="mt-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Ajouter le block
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
