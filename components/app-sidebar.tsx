'use client';
import type * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from "@/components/ui/sidebar"
import {
  ChevronDown,
  Plus,
  NotebookPen,
  FolderPlus,
  User,
  Settings,
  LogOut
} from 'lucide-react'
import { VersionSwitcher } from "./version-switcher"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from 'react';
import { Notes } from "@/types/types";
import Color from "@tiptap/extension-color";

// Sample data structure
const initialData = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Categories",
      url: "#",
      canAdd: true,
      items: [
        { title: "Liste des categories", url: "/categories" }
      ],
    },
    {
      title: "Sous Categories",
      url: "#",
      canAdd: true,
      items: [
        { title: "Liste des sous-categories", url: "/sous-categories" }
      ],
    },
    {
      title: "Notes",
      url: "#",
      canAdd: true,
      items: [

      ],
    }
  ]
}

interface Note {
  title: string;
  icone?: string;
  url: string;
  color?: string; // Maintenant facultatif
  // Ajoutez d'autres propriétés si elles existent dans vos notes
}

type NoteItem = {
  title: string;
  url: string;
  icone?: string;
  color?: string; // Maintenant facultatif
  isActive?: boolean;
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navData, setNavData] = useState<typeof initialData>(initialData);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesRes = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/notes/listeNotes`);
        if (!notesRes.ok) throw new Error('Erreur de chargement des notes');
        const notesData = await notesRes.json();

        if (Array.isArray(notesData.notes)) {
          // Create note items from the API data
          const noteItems: NoteItem[] = notesData.notes.map((note: Note) => ({
            title: note.title,
            url: `/notes/${note.title}`
          }));

          // Make a deep copy of the current navData
          const updatedNavData = JSON.parse(JSON.stringify(navData));

          // Find the Notes section and update its items
          const notesSection = updatedNavData.navMain.find((section: any) => section.title === "Notes");
          if (notesSection) {
            // Keep the "Mes Notes" item and add all the individual notes
            notesSection.items = [
              { title: "Ajouter un block Notes", icone: <NotebookPen />, url: "/addBlock", color: "red" },
              ...noteItems
            ];
          }

          // Update the state with the new data
          setNavData(updatedNavData);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <Sidebar {...props} className="flex flex-col h-screen">
      <SidebarHeader className="p-2 border-b">
        <div className="flex items-center justify-center" style={{ height: "45px" }}>
          <div className="">
            test
          </div>
        </div>

      </SidebarHeader>

      <SidebarContent className="flex-grow overflow-y-auto space-y-2 p-2">
        {navData.navMain.map((section) => (
          <Collapsible key={section.title} defaultOpen={section.title === "Categories"}>
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
  {section.items.map((item: NoteItem) => (
    <a
      key={item.title}
      href={item.url}
      className={`flex items-center px-2 py-1 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
        item.isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      }`}
    >      <span>{item.title}</span>

      {item.icone && (
        <span className={`mr-2 text-${item.color ? item.color + "-500" : "inherit"} ms-2`}>
          <i className={item.icone}>{item.icone}</i>
        </span>
      )}
    </a>
  ))}
</CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* Profile Section at the Bottom */}
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
  )
}