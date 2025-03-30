'use client'
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import PostArticle from "../components/PostArticle";
import { useAlert } from "@/contexts/Alert";

export default function Dashboard() {
  const { addAlert } = useAlert();

  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "/path/to/user/image.jpg"
  };

  const handleLogout = () => {
    console.log('Déconnexion en cours...');
  };


  return (<>
  <Navbar>
<PostArticle/>

  </Navbar>

  </>

  );
}