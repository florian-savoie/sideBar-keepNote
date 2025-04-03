'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/Navbar";
import PostBlock from "../page";
import { useAlert } from "@/contexts/Alert";
import PostArticle from "@/app/components/PostArticle";
type CategorieData = {
  id: number;
  title: string;
};
export default function Dashboard() {
  const { addAlert } = useAlert();
  const [categorieData, setCategorieData] = useState<CategorieData | null>(null);
  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : null;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notesCategorie/get/${id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des noteGroups");

        // Adjust data parsing to match the API response format
        const responseData = await response.json();
        console.log("Raw response data:", responseData);
        // Check if the response is already in the expected format or nested
        const data: CategorieData = responseData.id ? responseData : responseData.note;
        
        if (!data) {
          throw new Error("Format de données invalide");
        }
        
        setCategorieData(data);
        console.log("Data fetched successfully:", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [id]);




  return (<>
  <Navbar>
  <PostArticle title={categorieData?.title as string} />

  </Navbar>

  </>

  );
}