"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const noteSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
});

type NoteFormData = z.infer<typeof noteSchema>;

type CategorieData = {
  id: number;
  title: string;
};

export default function PostBlock() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [categorieData, setCategorieData] = useState<CategorieData | null>(null);
  const router = useRouter();
  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : null;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/get/${id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des noteGroups");

        // Adjust data parsing to match the API response format
        const responseData = await response.json();
        console.log("Raw response data:", responseData);
        // Check if the response is already in the expected format or nested
        const data: CategorieData = responseData.id ? responseData : responseData.note;
        
        if (!data) {
          throw new Error("Format de données invalide");
        }
        
        setCategorieData(data);
        console.log("Data fetched successfully:", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      // Pre-fill the form with category data if it exists
      title: categorieData?.title || "",
    }
  });

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      // Determine if we're creating a new category or updating an existing one
      const url = id 
        ? `${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/categorieNotes/update/${id}`
        : `${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/categorieNotes/create`;
      
      const method = id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => {
          setIsSuccess(false);
          // Redirect to categories list after success if needed
          if (!id) {
            router.push("/notes/categories");
          }
        }, 3000);
      } else {
        console.error("Erreur lors de l'envoi du formulaire");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-500">
                  {id ? "Modifier la catégorie" : "Nouvelle catégorie"}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">
                {id ? "Modifier une catégorie de notes" : "Créer une catégorie de notes"}
              </CardTitle>
              <CardDescription>
                {id 
                  ? "Modifiez les détails de votre catégorie de notes"
                  : "Organisez vos idées en créant une nouvelle catégorie pour vos notes"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="bg-green-50 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium text-green-800">
                    {id ? "Catégorie modifiée avec succès!" : "Catégorie créée avec succès!"}
                  </h3>
                  <p className="text-green-600 mt-1">
                    {id 
                      ? "Vos modifications ont été enregistrées."
                      : "Votre nouvelle catégorie de notes est prête à être utilisée."
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Titre de la catégorie</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Ex: Projets personnels, Idées créatives..."
                      className="h-12 px-4 rounded-md border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      defaultValue={categorieData?.title || ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (id ? "Modification en cours..." : "Création en cours...") 
                      : (id ? "Modifier la catégorie" : "Créer la catégorie")
                    }
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full opacity-70"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-100 rounded-full opacity-70"></div>
            <img
              src="/categorieNotes.png"
              alt="Organisation des notes"
              className="relative z-10 w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}