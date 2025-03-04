import { getPosts, getMostViewedPosts, getMostLikedPosts } from "@/lib/posts"
import { getSiteConfig } from "@/lib/site-config"
import BlogHeader from "@/components/blog-header"
import BlogFooter from "@/components/blog-footer"
import BlogSidebar from "@/components/blog-sidebar"
import PostCard from "@/components/post-card"
import PopularPosts from "@/components/popular-posts"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const posts = await getPosts()
  const siteConfig = await getSiteConfig()
  const mostViewedPosts = await getMostViewedPosts()
  const mostLikedPosts = await getMostLikedPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader title={siteConfig.title} logo={siteConfig.logo} showLogo={siteConfig.showLogo} />

      <div className="container mx-auto flex-grow py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Posts Recentes</h1>
              <Button asChild>
                <Link href="/posts">Ver Todos</Link>
              </Button>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-xl font-medium mb-2">Nenhum post encontrado</h3>
                <p className="text-muted-foreground">Os posts aparecerão aqui quando forem criados.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Posts Populares</h2>
              <PopularPosts mostViewed={mostViewedPosts} mostLiked={mostLikedPosts} />
            </div>
          </main>

          <BlogSidebar config={siteConfig.sidebar} />
        </div>
      </div>

      <BlogFooter
        copyright={siteConfig.footer.copyright}
        links={siteConfig.footer.links}
        socialLinks={siteConfig.footer.socialLinks}
      />
    </div>
  )
}

