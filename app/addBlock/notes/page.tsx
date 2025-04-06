'use client'

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAlert } from "@/contexts/Alert";
import PostArticle from "@/app/components/PostArticle";
import { useSearchParams } from 'next/navigation';

type CategorieData = {
  id: number;
  title: string;
};

export default function Dashboard() {
  const { addAlert } = useAlert();
  const [categorieData, setCategorieData] = useState<CategorieData | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('categorie'); // On lit `id` à l'intérieur du useEffect

    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/get/${id}`);
        console.log("Fetching URL:", response.url);

        if (!response.ok) throw new Error("Erreur lors de la récupération des noteGroups");

        const responseData = await response.json();
        console.log("Raw response data:", responseData);

        const data: CategorieData = responseData.id ? responseData : responseData.note;

        if (!data) {
          throw new Error("Format de données invalide");
        }

        setCategorieData(data);
        console.log("Data fetched successfully:", categorieData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        addAlert("Erreur lors du chargement de la catégorie", "error");
      }
    };

    fetchData();
  }, [searchParams]); // <-- Important : met `searchParams` comme dépendance ici

  return (
    <Navbar>
      {categorieData ? (
        
        <PostArticle title={categorieData.title} />
      ) : (
        <p>Chargement...</p>
      )}
    </Navbar>
  );
}
