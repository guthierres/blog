"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Editor } from "@tinymce/tinymce-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { createPost, updatePost } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const postSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  slug: z.string().min(1, "O slug é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  excerpt: z.string().min(1, "O resumo é obrigatório"),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
  initialData?: PostFormValues & { id: string }
}

export default function PostForm({ initialData }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isEditing = !!initialData

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      published: false,
    },
  })

  async function onSubmit(values: PostFormValues) {
    try {
      setIsSubmitting(true)

      if (isEditing) {
        await updatePost(initialData.id, values)
        toast.success("Post atualizado com sucesso!")
      } else {
        await createPost(values)
        toast.success("Post criado com sucesso!")
        router.push("/admin")
      }
    } catch (error) {
      toast.error(isEditing ? "Erro ao atualizar o post." : "Erro ao criar o post.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const title = form.getValues("title")
    if (!title) return

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    form.setValue("slug", slug)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>O título do seu post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>URL amigável para o post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" onClick={generateSlug} className="mb-2">
              Gerar
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Um breve resumo do post que será exibido nos cards.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem de Capa</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>URL da imagem de capa do post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>O conteúdo completo do post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publicar</FormLabel>
                <FormDescription>Tornar este post visível para os visitantes.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Post" : "Criar Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

