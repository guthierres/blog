import { getPostBySlug, getPosts } from "@/lib/posts"
import { getSiteConfig } from "@/lib/site-config"
import BlogHeader from "@/components/blog-header"
import BlogFooter from "@/components/blog-footer"
import BlogSidebar from "@/components/blog-sidebar"
import Comments from "@/components/comments"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const post = await getPostBySlug(params.slug)
  const siteConfig = await getSiteConfig()

  if (!post) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from("users").select("role").eq("id", user?.id).single()

  const currentUser = user ? { id: user.id, role: userData?.role } : null

  const { data: comments } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      author:users(name)
    `)
    .eq("post_id", post.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader title={siteConfig.title} logo={siteConfig.logo} showLogo={siteConfig.showLogo} />

      <div className="container mx-auto flex-grow py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <main className="flex-1">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <h1>{post.title}</h1>
              <div className="text-muted-foreground mb-6">Publicado em {formatDate(post.created_at)}</div>
              {post.cover_image && (
                <img
                  src={post.cover_image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-[300px] object-cover rounded-lg mb-6"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <Comments postId={post.id} comments={comments || []} currentUser={currentUser} />
          </main>

          <BlogSidebar config={siteConfig.sidebar} />
        </div>
      </div>

      <BlogFooter
        copyright={siteConfig.footer.copyright}
        links={siteConfig.footer.links}
        showSocial={siteConfig.footer.showSocial}
        socialLinks={siteConfig.footer.socialLinks}
      />
    </div>
  )
}

