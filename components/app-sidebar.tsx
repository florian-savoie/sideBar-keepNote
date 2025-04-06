"use client";

import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  Plus,
  NotebookPen,
  User,
  Settings,
  LogOut,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Interfaces pour les types de données
interface Note {
  id: number;
  title: string;
  url: string;
  description?: string;
  pathImage?: string | null;
  pathType?: string;
}

interface NoteGroup {
  id: number;
  title: string;
  notes: Note[];
}

interface NavItem {
  title: string;
  url: string;
  icone?: reac;
}

interface NavSection {
  title: string;
  url: string;
  canAdd: boolean;
  items: NavItem[];
  noteGroups?: NoteGroup[];
}

interface NavData {
  navMain: NavSection[];
}

// Structure initiale des données
const initialData: NavData = {
  navMain: [
    {
      title: "Categories",
      url: "#",
      canAdd: true,
      items: [{ title: "Liste des catégories", url: "/categories" }],
    },
    {
      title: "Sous Categories",
      url: "#",
      canAdd: true,
      items: [{ title: "Liste des sous-catégories", url: "/sous-categories" }],
    },
    {
      title: "Notes",
      url: "#",
      canAdd: true,
      items: [
        { title: "Ajouter un block Notes", url: "/addBlock", icone: <NotebookPen /> },
      ],
      noteGroups: [],
    },
  ],
};

// Typage des props du composant Sidebar
interface AppSidebarProps {
  className?: string;
  [key: string]: any; // Pour accepter d'autres props passées au composant Sidebar
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const [navData, setNavData] = useState<NavData>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/listeNotes`, {
          credentials: "include", // Inclure les cookies pour l'authentification
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des noteGroups");

        const data: { noteGroups: NoteGroup[] } = await response.json();

        // Mettre à jour les données de navigation
        const updatedNavData: NavData = { ...navData };
        const notesSection = updatedNavData.navMain.find(
          (section) => section.title === "Notes"
        );
        if (notesSection) {
          notesSection.noteGroups = data.noteGroups.map((group) => ({
            id: group.id,
            title: group.title,
            notes: group.notes,
          }));
        }

        setNavData(updatedNavData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []); // Ajout de navData comme dépendance pour éviter des problèmes de mise à jour

  return (
    <Sidebar {...props} className="flex flex-col h-screen">
      <SidebarHeader className="p-2 border-b">
        <div className="flex items-center justify-center" style={{ height: "45px" }}>
          <div className="">test</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow overflow-y-auto space-y-2 p-2">
        {navData.navMain.map((section) => (
          <Collapsible key={section.title} defaultOpen={section.title === "Notes"}>
            <div className="flex items-center justify-between mb-2">
              <CollapsibleTrigger className="flex items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors">
                <span className="font-medium mr-2">{section.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>

              {section.canAdd && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  title={`Ajouter ${section.title.toLowerCase()}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <CollapsibleContent className="space-y-1 pl-4 pt-2">
              {/* Rendu des items statiques */}
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className="flex items-center px-2 py-1 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                >
                  {item.icone && <span className="mr-2">{item.icone}</span>}
                  <span>{item.title}</span>
                </a>
              ))}

              {/* Rendu des noteGroups pour la section Notes */}
              {section.title === "Notes" &&
                section.noteGroups &&
                section.noteGroups.map((group) => (
                  <Collapsible key={`group-${group.id}`}>
                    <CollapsibleTrigger className="flex items-center w-full px-2 py-1 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                      <span className="flex-grow text-left">{group.title}</span>
                      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pl-4 space-y-1 pt-1">
                    <Button size="sm" className="flex items-center" asChild>
      <Link href={`/addBlock/notes?categorie=${group.id}`} >
        <Plus className="h-4 w-4 mr-2" />
        <span>Ajouter une Note</span>
      </Link>
    </Button>
                      {group.notes.map((note) => (
                        <a
                          key={`note-${note.id}`}
                          href={note.url}
                          className="flex items-center px-2 py-1 rounded-md text-xs transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                        >
                          <span>{note.title}</span>
                        </a>
                      ))}
                      {group.notes.length === 0 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground italic text-warning">
                          Aucune note Actuellement
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* Section Profil */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center space-x-3 hover:bg-accent p-2 rounded-md">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-grow text-left">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Compte Personnel</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}