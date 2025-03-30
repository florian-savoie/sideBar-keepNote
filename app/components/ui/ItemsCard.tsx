'use client';
import { CalendarIcon, Edit2Icon, XCircleIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Notes } from "@/types/types";
import Link from "next/link";

interface ItemsCardProps {
  props: Notes;
  deleteNote?: (note: Notes) => void;
}

export default function ItemsCard({ props, deleteNote }: ItemsCardProps) {
  if (!props) return null;

  const handleDelete = () => {
    if (deleteNote) {
      deleteNote(props);
    }
  };

  return (
    <Card className="max-w-sm overflow-hidden relative group hover:shadow-lg transition-all duration-300">
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        aria-label="Supprimer"
      >
        <XCircleIcon className="h-5 w-5 text-red-500" />
      </button>

      {/* Edit button */}
      <a
        className="absolute top-2 right-10 z-10 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
        aria-label="Modifier"
        href={`/notes/edit/${props.id}`}
      >
        <Edit2Icon className="h-5 w-5 text-blue-500" />
      </a>

      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={props.pathImage || "/placeholder.svg?height=400&width=600"}
          alt={props.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(props.createdAt).toLocaleDateString()}</span>
        </div>
        <CardTitle className="line-clamp-1">{props.title}</CardTitle>
        <CardDescription className="line-clamp-2">{props.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {props.creatorPseudo && (
            <span className="font-medium">Par: {props.creatorPseudo}</span>
          )}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-1" asChild>
          <Link href={`/notes/show/${props.id}`}>
            <FileTextIcon className="h-4 w-4" />
            Voir la fiche
          </Link>
        </Button>

        <Button className="flex-1 gap-1" asChild>
          <Link href={props.pathType} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="h-4 w-4" />
            Visiter le site
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
