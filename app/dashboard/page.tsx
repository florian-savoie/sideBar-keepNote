'use client'
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import PostArticle from "../components/PostArticle";
import { useAlert } from "@/contexts/Alert";
import Modal from "../components/ui/Modal";

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
  <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
  <Modal/>
  </Navbar>

  </>

  );
}