import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SidebarConfig {
  showAbout: boolean
  aboutTitle: string
  aboutContent: string
  showCategories: boolean
  categoriesTitle: string
  categories: { name: string; slug: string }[]
  showRecentPosts: boolean
  recentPostsTitle: string
  recentPosts: { title: string; slug: string }[]
}

interface BlogSidebarProps {
  config: SidebarConfig
}

export default function BlogSidebar({ config }: BlogSidebarProps) {
  return (
    <aside className="w-full md:w-[300px] space-y-6">
      {config.showAbout && (
        <Card>
          <CardHeader>
            <CardTitle>{config.aboutTitle || "Sobre"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{config.aboutContent || "Bem-vindo ao meu blog!"}</p>
          </CardContent>
        </Card>
      )}

      {config.showCategories && config.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{config.categoriesTitle || "Categorias"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {config.categories.map((category, index) => (
                <li key={index}>
                  <Link href={`/category/${category.slug}`} className="text-sm hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {config.showRecentPosts && config.recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{config.recentPostsTitle || "Posts Recentes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {config.recentPosts.map((post, index) => (
                <li key={index}>
                  <Link href={`/posts/${post.slug}`} className="text-sm hover:underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}

