"use client";

import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { Check, Search } from "lucide-react";

interface Item {
  id: number;
  name: string;
}

interface SelectTypeHeadProps {
  onSelect?: (item: Item | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function SelectTypeHead({
  onSelect,
  placeholder = "Rechercher...",
  label,
  className = "w-full",
}: SelectTypeHeadProps) {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]); // Liste complète des éléments
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Liste filtrée affichée
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger toutes les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PATH_URL || "";
        const response = await fetch(`${baseUrl}/api/notesCategorie/get/all`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const categories = data.categories || data.noteGroups || data;
        if (Array.isArray(categories)) {
          setAllItems(categories); // Stocker toutes les données
          setFilteredItems(categories); // Afficher toute la liste au départ
        } else {
          console.error("Expected an array in response, got:", data);
          setAllItems([]);
          setFilteredItems([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setAllItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Appeler immédiatement au montage
  }, []); // Pas de dépendances, exécuté une seule fois au montage

  // Filtrer les éléments en fonction de la query
  useEffect(() => {
    if (query === "") {
      setFilteredItems(allItems); // Si la query est vide, afficher toute la liste
    } else {
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered); // Mettre à jour la liste filtrée
    }
  }, [query, allItems]); // Dépendances : query et allItems

  const handleSelect = (item: Item | null) => {
    setSelectedItem(item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className={className}>
      {label && <div className="mb-2 text-sm font-medium">{label}</div>}
      <Combobox value={selectedItem} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Combobox.Input
              className="w-full border rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(item: Item | null) => item?.name || ""}
              placeholder={placeholder}
            />
          </div>

          <Combobox.Options className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none text-sm">
            {isLoading ? (
              <div className="p-2 text-center text-gray-500">Chargement...</div>
            ) : filteredItems.length === 0 ? (
              <div className="p-2 text-center text-gray-500">Aucun résultat</div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <Check
                            className={`h-4 w-4 ${
                              active ? "text-white" : "text-primary"
                            }`}
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}