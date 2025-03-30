"use client";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/Navbar";
import ItemsCard from "../../components/ui/ItemsCard";
import { useAlert } from "@/contexts/Alert";
import { useState, useEffect } from 'react';
import { Notes } from "@/types/types";

export default function Dashboard() {
  const { addAlert } = useAlert();
  const [notes, setNotes] = useState<Notes[]>([]); // Initialiser avec un tableau vide
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const notesRes = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/get`);
        if (!notesRes.ok) throw new Error('Erreur de chargement des notes');
        const notesData = await notesRes.json();
        console.log(notesData); // Vérifier les données reçues

        // Vérifier si notesData contient une clé "notes" et est un tableau
        if (Array.isArray(notesData.notes)) {
          setNotes(notesData.notes); // Assurez-vous que notesData.notes est un tableau d'objets de type Notes[]
        } else {
          throw new Error('Les données ne sont pas au bon format');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement des notes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar>
        <h3 className="text-center text-primary">Mes Notes</h3>
        
        {/* API loading state */}
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-red-500 text-center p-4">
            Error loading notes: {error}
          </div>
        )}

        {/* Success state - Affichage des notes */}
        {notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {notes.map((note) => (
              <ItemsCard 
                key={note.id}
                props={note}  // Passer l'ensemble de l'objet note
              />
            ))}
          </div>
        )}
      </Navbar>
    </>
  );
}
