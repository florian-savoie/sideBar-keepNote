'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Notes } from "@/types/types";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import Modal from "@/app/components/ui/Modal";
import { useRouter } from "next/navigation"; // Corrected from router
import ItemsCard from "../../../components/ui/ItemsCard";
import { useAlert } from '@/contexts/Alert';
import Navbar from '../../../components/Navbar';
import { useParams } from "next/navigation";

export default function Dashboard() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNote, setModalNote] = useState<Notes | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
  
  const router = useRouter(); // Use the hook correctly
  const modalRef = useRef<HTMLDialogElement>(null);
  const { addAlert } = useAlert();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/get/noteCategorie/${id}`, {
          credentials: "include" // Important for session cookies
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Erreur de chargement des notes');
        }
        
        const data = await response.json();
        
        // Check if the data structure is correct
        if (Array.isArray(data.notes)) {
          setNotes(data.notes);
          setCategoryTitle(data.category?.title || "Mes Notes");
        } else {
          console.error("Structure de données incorrecte:", data);
          throw new Error('Les données ne sont pas au bon format');
        }
      } catch (err: any) {
        console.error("Erreur fetchData:", err);
        setError(err.message || 'Erreur de chargement des notes');
        addAlert('Erreur de chargement des notes', "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, addAlert]);

  const handleDelete = (note: Notes) => {
    setModalNote(note);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const deleteNote = async () => {
    if (!modalNote) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/delete/${modalNote.id}`, {
        method: 'DELETE',
        credentials: "include" // Important for session cookies
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Erreur lors de la suppression");
      }
      
      // Update local state to remove deleted note
      setNotes(prev => prev.filter(note => note.id !== modalNote.id));
      addAlert('Note supprimée avec succès', "success");
      
      // No need to redirect, just update the UI
    } catch (error: any) {
      console.error("Erreur deleteNote:", error);
      addAlert(error.message || "Erreur lors de la suppression", "error");
    } finally {
      closeModal();
    }
  };

  const customButtons = [
    <Button key="1" variant="outline" onClick={closeModal}>Annuler</Button>,
    <Button key="2" variant="destructive" onClick={deleteNote}>Supprimer</Button>,
  ];

  // Filter notes based on search
  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.creatorPseudo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Navbar>
      <div className="container mx-auto px-4 py-6">
        {/* Search and header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">
            {categoryTitle}
          </h1>
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
              <Link href={`/notes/new?category=${id}`} className="flex items-center gap-1">
                <PlusCircle size={18} />
                Ajouter
              </Link>
            </Button>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {isClient && (
          <Modal 
            ref={modalRef} 
            title="Supprimer la note" 
            description={`Êtes-vous sûr de vouloir supprimer "${modalNote?.title}" ?`} 
            btn={customButtons} 
            onClose={closeModal} 
          />
        )}

        {/* States handling */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune note dans cette catégorie</p>
            <Button asChild className="mt-4">
              <Link href={`/notes/new?category=${id}`}>
                Ajouter une note
              </Link>
            </Button>
          </div>
        )}

        {/* Notes grid */}
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