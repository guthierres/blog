"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createTag, deleteTag } from "@/lib/actions"

const tagSchema = z.object({
  name: z.string().min(1, "O nome da tag é obrigatório"),
  slug: z.string().min(1, "O slug da tag é obrigatório"),
})

type TagFormValues = z.infer<typeof tagSchema>

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagsManagerProps {
  initialTags: Tag[]
}

export default function TagsManager({ initialTags }: TagsManagerProps) {
  const [tags, setTags] = useState(initialTags)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  async function onSubmit(values: TagFormValues) {
    try {
      setIsSubmitting(true)
      const newTag = await createTag(values)
      setTags([...tags, newTag])
      form.reset()
      toast.success("Tag criada com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar tag.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteTag(id: string) {
    try {
      await deleteTag(id)
      setTags(tags.filter((tag) => tag.id !== id))
      toast.success("Tag excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir tag.")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Tags</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Tag</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug da Tag</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Tag"}
          </Button>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Tags Existentes</h3>
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li key={tag.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span>
                {tag.name} ({tag.slug})
              </span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

