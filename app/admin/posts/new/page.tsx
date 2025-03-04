import AdminHeader from "@/components/admin/admin-header"
import PostForm from "@/components/admin/post-form"

export default function NewPostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Criar Novo Post</h1>

        <PostForm />
      </div>
    </div>
  )
}

