"use client";

import { useState, useEffect } from 'react';
import { Notes } from "@/types/types";

export default function NavListNotes() {
  const [notes, setNotes] = useState<Notes[]>([]); // Initialiser avec un tableau vide

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesRes = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/ListeNotes`);
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
       // setError(err.message || 'Erreur de chargement des notes');
      } finally {
      //  setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    
    </>
  );
}
