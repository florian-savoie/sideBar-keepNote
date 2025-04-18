'use client'

import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatarDropdown } from "../components/NavbarUserSection";
import { Divide, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./TogleDarkmode";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  children: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "/path/to/user/image.jpg"
  };
  const { user, userLoading } = useAuth();

  const handleLogout = () => {
    console.log('Déconnexion en cours...');
  };
  return user ? (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm h-16 shrink-0 flex items-center border-b px-4 z-50 pr-4">
        <div className="flex items-center w-full">
          {/* Sidebar Toggle and Breadcrumb Section */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Toggle Sidebar</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </SidebarTrigger>

            <Separator orientation="vertical" className="h-6 hidden md:block" />
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>
          
          {/* Title */}
          <div className="flex justify-center w-[100%]">Keep Note</div>

          {/* Right section */}
          <div className="flex items-center space-x-2 md:space-x-4" style={{ marginRight: "10px" }}>
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="pl-10 w-full md:w-64"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                size={20} 
              />
            </div>

            {/* User Avatar or Login Button */}
            <div className="flex items-center">
              <div className="me-3">
                <ModeToggle />
              </div>

              {user ? (
                <UserAvatarDropdown
                  user={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Button asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="pt-20 p-5">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>  ) : (
    <>
    </>
  );
 
}
