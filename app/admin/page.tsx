import { getSiteConfig } from "@/lib/site-config"
import AdminHeader from "@/components/admin/admin-header"
import SiteConfigForm from "@/components/admin/site-config-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostsList from "@/components/admin/posts-list"
import CategoriesManager from "@/components/admin/categories-manager"
import TagsManager from "@/components/admin/tags-manager"
import PagesManager from "@/components/admin/pages-manager"
import { getPosts, getCategories, getTags, getPages } from "@/lib/actions"

export default async function AdminPage() {
  const siteConfig = await getSiteConfig()
  const posts = await getPosts()
  const categories = await getCategories()
  const tags = await getTags()
  const pages = await getPages()

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Painel de Controle</h1>

        <Tabs defaultValue="config">
          <TabsList className="mb-8">
            <TabsTrigger value="config">Configurações do Site</TabsTrigger>
            <TabsTrigger value="posts">Gerenciar Posts</TabsTrigger>
            <TabsTrigger value="pages">Gerenciar Páginas</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <SiteConfigForm initialData={siteConfig} />
          </TabsContent>

          <TabsContent value="posts">
            <PostsList posts={posts} />
          </TabsContent>

          <TabsContent value="pages">
            <PagesManager initialPages={pages} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager initialCategories={categories} />
          </TabsContent>

          <TabsContent value="tags">
            <TagsManager initialTags={tags} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

