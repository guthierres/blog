import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Settings, Plus } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="border-b bg-primary text-primary-foreground">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h1 className="text-xl font-bold">Painel de Controle</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ver Site
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

