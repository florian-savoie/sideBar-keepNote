import type React from "react"
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
              <div>TEST </div>

      </SidebarGroup>
    </form>
  )
}

