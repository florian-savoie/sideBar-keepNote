"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X, Link } from "lucide-react";
import SelectTypeHead from "../components/ui/SelectTypeHead";
import TextareaCustom from "@/app/components/TextareaCustom";

export default function AddNote(props: { title: string , id:number}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categorieNotes, setCategorieNotes] = useState<string | null>(
    props.title || null
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    noteGroupId: props.id || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "La description est trop courte";
    }



    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "L'URL doit être valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData({ ...formData, imageUrl: "" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    setFormData({ ...formData, imageUrl: url });
    setImageFile(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const submitFormData = new FormData();
    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);

    if (formData.noteGroupId !== null) {
      submitFormData.append("noteGroupId", formData.noteGroupId.toString());
    }

    if (imageFile) {
      submitFormData.append("imageFile", imageFile);
    } else if (formData.imageUrl) {
      submitFormData.append("imageUrl", formData.imageUrl);
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        alert("Note ajoutée avec succès !");
        setImageFile(null);
        setImagePreview(null);
        setSelectedCategory(null);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          noteGroupId: null,
        });
      } else {
        const errorData = await response.json();
        alert(
          `Erreur lors de l'ajout de la note: ${
            errorData.message || "Erreur inconnue"
          }`
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la communication avec le serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-center">
            Ajouter une Note dans{" "}
            <span className="text-primary">&nbsp;{props.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Catégorie avec SelectTypeHead */}
            <div>
              <SelectTypeHead
                label="Catégorie"
                placeholder={`Categorie ${props.title}`}
                onSelect={(item) => {
                  if (item) {
                    setFormData({ ...formData, noteGroupId: item.id });
                    setCategorieNotes(item.name);
                    setSelectedCategory(item.name);
                  } else {
                    setFormData({ ...formData, noteGroupId: null });
                    setSelectedCategory(null);
                  }
                }}
              />
              {selectedCategory && (
                <p className="mt-1 text-sm text-primary">
                  Catégorie sélectionnée: {selectedCategory}
                </p>
              )}
            </div>

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

                    <div className="text-center text-gray-500">ou</div>

                    <div className="relative">
                      <Input
                        type="text"
                        name="imageUrl"
                        placeholder="Coller l'URL de l'image"
                        value={formData.imageUrl}
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
                        {errors.imageUrl}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Titre */}
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre de la note"
                className="mt-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <TextareaCustom
                value={formData.description}
                onChange={handleInputChange}
                id="description"
                name="description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

        
            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : "Ajouter la note"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
