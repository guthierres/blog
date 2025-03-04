"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createCategory, deleteCategory } from "@/lib/actions"

const categorySchema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  slug: z.string().min(1, "O slug da categoria é obrigatório"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoriesManagerProps {
  initialCategories: Category[]
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  async function onSubmit(values: CategoryFormValues) {
    try {
      setIsSubmitting(true)
      const newCategory = await createCategory(values)
      setCategories([...categories, newCategory])
      form.reset()
      toast.success("Categoria criada com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar categoria.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      await deleteCategory(id)
      setCategories(categories.filter((category) => category.id !== id))
      toast.success("Categoria excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir categoria.")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Categoria</FormLabel>
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
                <FormLabel>Slug da Categoria</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Categoria"}
          </Button>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Categorias Existentes</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span>
                {category.name} ({category.slug})
              </span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

