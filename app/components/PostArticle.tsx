"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Link } from "lucide-react";

// 🛠️ Schéma de validation avec Zod
const noteSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  creator: z.string().min(3, "Le pseudo est requis"),
  imageUrl: z.string().url().optional(),
  imageFile: z.instanceof(File).optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function AddNote() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setValue("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setValue("imageUrl", ""); // Reset URL
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    setValue("imageUrl", url);
    setImageFile(null); // Reset file upload
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("imageUrl", "");
    setValue("imageFile", undefined);
  };

  const onSubmit = async (data: NoteFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("creator", data.creator);

    if (imageFile) formData.append("imageFile", imageFile);
    else if (data.imageUrl) formData.append("imageUrl", data.imageUrl);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Note ajoutée avec succès !");
      } else {
        alert("Erreur lors de l'ajout de la note");
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
            {/* Image Upload or URL */}
            <div>
              <Label>Image</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative w-full max-w-sm">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* File Upload */}
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Upload className="w-10 h-10 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Importer une image
                      </p>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>

                    {/* OR */}
                    <div className="text-center text-gray-500">ou</div>

                    {/* Image URL Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Coller l'URL de l'image"
                        {...register("imageUrl")}
                        onChange={handleImageUrlChange}
                        className="pl-10"
                      />
                      <Link
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                    {errors.imageUrl && (
                      <p className="text-red-500 text-sm">
                        {errors.imageUrl.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <Label htmlFor="title">Titre</Label>
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

            {/* Description Textarea */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Contenu de la note..."
                className="mt-2 min-h-[200px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Creator Pseudo */}
            <div>
              <Label htmlFor="creator">Pseudo du créateur</Label>
              <Input
                id="creator"
                {...register("creator")}
                placeholder="Votre pseudo"
                className="mt-2"
              />
              {errors.creator && (
                <p className="text-red-500 text-sm">{errors.creator.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Ajouter la note
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
