import { getPageBySlug, getPages } from "@/lib/actions"
import { getSiteConfig } from "@/lib/site-config"
import BlogHeader from "@/components/blog-header"
import BlogFooter from "@/components/blog-footer"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Comments from "@/components/comments"

export async function generateStaticParams() {
  const pages = await getPages()

  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export default async function PageContent({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const page = await getPageBySlug(params.slug)
  const siteConfig = await getSiteConfig()

  if (!page) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from("users").select("role").eq("id", user?.id).single()

  const currentUser = user ? { id: user.id, role: userData?.role } : null

  const headerPages = await getPages().then((pages) => pages.filter((p) => p.position === "header"))
  const footerPages = await getPages().then((pages) => pages.filter((p) => p.position === "footer"))

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader
        title={siteConfig.title}
        logo={siteConfig.logo}
        showLogo={siteConfig.showLogo}
        headerPages={headerPages}
      />

      <div className="container mx-auto flex-grow py-8 px-4">
        <main className="prose prose-lg dark:prose-invert max-w-none">
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />

          {page.allow_comments && <Comments postId={page.id} currentUser={currentUser} />}
        </main>
      </div>

      <BlogFooter
        copyright={siteConfig.footer.copyright}
        links={siteConfig.footer.links}
        socialLinks={siteConfig.footer.socialLinks}
        footerPages={footerPages}
      />
    </div>
  )
}

