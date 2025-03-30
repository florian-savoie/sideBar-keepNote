"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Notes } from "@/types/types";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAlert } from "@/contexts/Alert";
import { ArrowLeft, Loader2, Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ShowNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState<Notes | null>(null);

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
      } catch (error: any) {
        addAlert("Erreur lors du chargement de la note", "error");
        router.push("/notes"); // Redirige si la note n’est pas trouvée
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, addAlert, router]);

  if (isLoading) {
    return (
      <Navbar>
        <div className="container mx-auto px-4 py-6 flex justify-center items-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Navbar>
    );
  }

  if (!note) {
    return (
      <Navbar>
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-500">Aucune note trouvée.</p>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Bouton Retour */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Retour
          </Button>
        </div>

        {/* Carte de la note */}
        <Card className="shadow-md border-none overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{note.title}</h1>
          </CardHeader>

          <CardContent className="p-6">
            {/* Image */}
            <div className="relative w-full h-[250px] md:h-[400px] mb-6 rounded-lg overflow-hidden bg-gray-100">
              {note.pathImage ? (
                <Image
                  src={note.pathImage}
                  alt={note.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg?height=400&width=600")}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
              <span>{note.creatorPseudo || "Utilisateur inconnu"}</span>
              <span>
                {new Date(note.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {note.pathType && (
                <a
                  href={note.pathType}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink size={14} />
                  <span>{note.pathType.replace(/^https?:\/\//, "").split("/")[0]}</span>
                </a>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {note.description ? (
                <div dangerouslySetInnerHTML={{ __html: note.description }} />
              ) : (
                <p className="text-gray-500 italic">Aucune description disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Navbar>
  );
}