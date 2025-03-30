'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Notes } from "@/types/types";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAlert } from "@/contexts/Alert";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, ExternalLink, Edit } from "lucide-react";
import Image from "next/image";
import TextareaCustom from "@/app/components/TextareaCustom";

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [note, setNote] = useState<Notes | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pathType: "",
    pathImage: ""
  });

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/${id}`);
        if (!response.ok) {
          throw new Error("Note introuvable");
        }
        const data = await response.json();
        setNote(data.note);
        setFormData({
          title: data.note.title,
          description: data.note.description,
          pathType: data.note.pathType || "",
          pathImage: data.note.pathImage || ""
        });
      } catch (error: any) {
        addAlert("Erreur lors du chargement de la note", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, addAlert, router]);
// EditNotePage.tsx (extrait)
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
      ...prev,
      [name]: value
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError("Le titre et la description sont obligatoires");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      addAlert("Note mise à jour avec succès", "success");
      setTimeout(() => {
      //  router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      setFormError(error.message || "Une erreur est survenue");
      addAlert("Erreur lors de la mise à jour de la note", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <Navbar>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire d'édition */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Modifier la note
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : note ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                      <p className="font-medium">Erreur</p>
                      <p>{formError}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Titre *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Titre de la note"
                      className="rounded-md"
                      required
                    />
                  </div>
                  <TextareaCustom
    value={formData.description}
    onChange={handleChange}
    id="description"
    name="description"
/>
                

                  <div className="space-y-2">
                    <label htmlFor="pathType" className="block text-sm font-medium">
                      URL du site
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="pathType"
                        name="pathType"
                        value={formData.pathType}
                        onChange={handleChange}
                        placeholder="https://exemple.com"
                        type="url"
                        className="rounded-md flex-1"
                      />
                      {formData.pathType && (
                        <Button variant="outline" size="icon" type="button" asChild>
                          <a href={formData.pathType} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="pathImage" className="block text-sm font-medium">
                      URL de l'image
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="pathImage"
                        name="pathImage"
                        value={formData.pathImage}
                        onChange={handleChange}
                        placeholder="https://exemple.com/image.jpg"
                        type="url"
                        className="rounded-md flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        type="button"
                        onClick={togglePreview}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 rounded-md" 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Sauvegarder les modifications
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Note introuvable
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aperçu */}
          {!isLoading && note && (
            <Card className={`overflow-hidden transition-opacity duration-300 ${previewVisible || formData.pathImage ? 'opacity-100' : 'opacity-50'} border-primary`}> 
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 justify-center">
                  <ImageIcon className="h-5 w-5" />
                  Aperçu de la note
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Aperçu de l'image */}
                  <div className="relative h-64 w-full overflow-hidden rounded-md bg-gray-100 border">
                    {formData.pathImage ? (
                      <Image
                        src={formData.pathImage}
                        alt={formData.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=400&width=600";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                          <p>Aucune image définie</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Aperçu des données */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Titre</h3>
                      <p className="mt-1 font-semibold text-lg">{formData.title || "Aucun titre défini"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1" dangerouslySetInnerHTML={{ __html: formData.description || "Aucune description définie" }} />
                      </div>
                    
                    {formData.pathType && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Site</h3>
                        <a 
                          href={formData.pathType}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="mt-1 inline-flex items-center text-blue-600 hover:underline"
                        >
                          {formData.pathType.replace(/^https?:\/\//, '').split('/')[0]}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Créé par</h3>
                      <p className="mt-1">{note.creatorPseudo || "Utilisateur inconnu"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                      <p className="mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Navbar>
  );
}