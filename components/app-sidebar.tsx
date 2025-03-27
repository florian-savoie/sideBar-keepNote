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

// Sample data structure
const data = {
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
        { title: "Mes Notes", url: "/notes" }
      ],
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="flex flex-col h-screen">
      <SidebarHeader className="p-2 border-b">
        <div className="flex items-center justify-center"style={{height: "45px"}}>
           <div className="">
          test
        </div>
        </div>
       
      </SidebarHeader>

      <SidebarContent className="flex-grow overflow-y-auto space-y-2 p-2">
        {data.navMain.map((section) => (
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
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className={`block px-2 py-1 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                    item.isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.title}
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