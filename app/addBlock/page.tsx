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
import { useSearchParams } from 'next/navigation';
import Navbar from "../components/Navbar";

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
  const searchParams = useSearchParams();
  const id = searchParams.get('categorie'); // Récupère ?categorie=2

  useEffect(() => {
    console.log("Categorie ID from searchParams:", id); // Log pour vérifier la valeur
    if (!id || isNaN(parseInt(id))) {
      console.error("Invalid or missing categorie ID:", id);
      return;
    }

    const fetchData = async () => {
      const url = `${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/get/${id}`;
      console.log("Fetching URL:", url); // Log pour vérifier l'URL
      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const data: CategorieData = 'id' in responseData ? responseData : responseData.note;
        
        if (!data) {
          throw new Error("Format de données invalide");
        }
        
        setCategorieData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: categorieData?.title || "",
    },
  });

  // Mettre à jour les valeurs du formulaire quand categorieData change
  useEffect(() => {
    if (categorieData) {
      reset({ title: categorieData.title });
    }
  }, [categorieData, reset]);

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      const url = id 
        ? `${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/update/${id}`
        : `${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/create`;
  
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
        const responseData = await response.json();
  
        const createdId = responseData.noteGroup?.id;
  
        setIsSuccess(true);
        reset();
  
        setTimeout(() => {
          setIsSuccess(false);
          if (!id && createdId) {
            router.push(`/notes/categories/${createdId}`); // Redirection dynamique
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
     <Navbar>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full  ">
        <div className="order-2 md:order-1">
          <Card className="border-0 shadow-lg  ">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5  text-primary" />
                <span className="text-sm font-medium text-primary">
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
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary text-white rounded-md transition-colors"
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
     </Navbar>
  
  );
}