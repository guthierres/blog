import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Page {
  title: string
  slug: string
}

interface BlogHeaderProps {
  title: string
  logo?: string
  showLogo: boolean
  headerPages: Page[]
}

export default function BlogHeader({ title, logo, showLogo, headerPages }: BlogHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {showLogo && logo ? (
            <img src={logo || "/placeholder.svg"} alt={title} className="h-10 w-auto" />
          ) : (
            <h1 className="text-2xl font-bold">{title}</h1>
          )}
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/posts" className="text-sm font-medium hover:underline">
            Posts
          </Link>
          {headerPages.map((page) => (
            <Link key={page.slug} href={`/pages/${page.slug}`} className="text-sm font-medium hover:underline">
              {page.title}
            </Link>
          ))}
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

