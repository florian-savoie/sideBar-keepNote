import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ItemsCard() {
  return (
    <Card className="max-w-sm overflow-hidden ">
      <div className="relative h-48 w-full">
        <Image src="/placeholder.svg?height=400&width=600" alt="Blog post image" fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarIcon className="h-4 w-4" />
          <span>12 Mars 2024</span>
        </div>
        <CardTitle>Un titre captivant</CardTitle>
        <CardDescription>Sous-titre ou courte introduction de l'article</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim
          sit amet, adipiscing nec, ultricies sed, dolor.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Voir plus</Button>
      </CardFooter>
    </Card>
  )
}

