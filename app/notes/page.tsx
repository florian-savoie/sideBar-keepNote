'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Notes } from "@/types/types";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import Modal from "@/app/components/ui/Modal";  // Import du composant Modal
import router from "next/router";
import ItemsCard from "../components/ui/ItemsCard";  // Card des items
import { useAlert } from '@/contexts/Alert';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNote, setModalNote] = useState<Notes | null>(null);
  const [isClient, setIsClient] = useState(false); // Vérifier si c'est côté client

  const modalRef = useRef<HTMLDialogElement>(null);  // Référence de la modal

  const { addAlert } = useAlert();

  useEffect(() => {
    setIsClient(true); // Mettre à jour après que le composant soit monté côté client
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const notesRes = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/get`);
        if (!notesRes.ok) throw new Error('Erreur de chargement des notes');
        const notesData = await notesRes.json();
        
        if (Array.isArray(notesData.notes)) {
          setNotes(notesData.notes);
        } else {
          throw new Error('Les données ne sont pas au bon format');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement des notes');
        addAlert('Erreur de chargement des notes', "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [addAlert]);

  const handleDelete = (note: Notes) => {
    setModalNote(note); // Enregistre la note à supprimer
    if (modalRef.current) {
      modalRef.current.showModal();  // Ouvre la modal via ref
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();  // Ferme la modal via ref
    }
  };

  const deleteNote = async () => {
    if (!modalNote) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/delete/${modalNote.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Note introuvable");
      }
      alert('Note supprimée');
      router.push("/notes"); // Redirige après la suppression
    } catch (error: any) {
      alert("Erreur lors du chargement de la note");
    } finally {
      closeModal();
    }
  };

  const customButtons = [
    <Button key="1" onClick={closeModal}>Annuler</Button>,
    <Button key="2" onClick={deleteNote}>Valider</Button>,
  ];

  // Filtrer les notes en fonction de la recherche
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.creatorPseudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <Navbar>
    <div className="container mx-auto px-4 py-6">
      {/* Recherche */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">Mes Notes</h1>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <Button asChild>
            <Link href="/notes/new" className="flex items-center gap-1">
              <PlusCircle size={18} />
              Ajouter
            </Link>
          </Button>
        </div>
      </div>

      {/* Modal de suppression */}
      {isClient && (
        <Modal 
          ref={modalRef} 
          title="Supprimer la note" 
          description={`Êtes-vous sûr de vouloir supprimer "${modalNote?.title}" ?`} 
          btn={customButtons} 
          onClose={closeModal} 
        />
      )}

      {/* API loading, error and notes rendering */}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNotes.map(note => (
          <ItemsCard
            key={note.id}
            props={note}
            deleteNote={handleDelete}
          />
        ))}
      </div>
    </div>
    </Navbar>
  );
}
