import AdminHeader from "@/components/admin/admin-header"
import PostForm from "@/components/admin/post-form"
import { getPostById } from "@/lib/posts"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Editar Post</h1>

        <PostForm initialData={post} />
      </div>
    </div>
  )
}

