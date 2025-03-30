
export type Notes = {
    id: number;
    userId: number;
    title: string;
    description: string;
    pathImage?: string;   // optionnel, peut être null ou undefined
    pathType: string;
    createdAt: string;   // ou Date si tu veux un type Date
    updatedAt: string;   // ou Date
    creatorPseudo: string;
    user: {
      id: number;
      // Ajoute d'autres propriétés si nécessaire pour `User`
    };
  };