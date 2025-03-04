"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createPage, updatePage, deletePage } from "@/lib/actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const pageSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  slug: z.string().min(1, "O slug é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  allowComments: z.boolean().default(true),
  position: z.enum(["header", "footer"]),
})

type PageFormValues = z.infer<typeof pageSchema>

interface Page extends PageFormValues {
  id: string
}

interface PagesManagerProps {
  initialPages: Page[]
}

export default function PagesManager({ initialPages }: PagesManagerProps) {
  const [pages, setPages] = useState(initialPages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      allowComments: true,
      position: "footer",
    },
  })

  async function onSubmit(values: PageFormValues) {
    try {
      setIsSubmitting(true)
      if (editingPage) {
        const updatedPage = await updatePage(editingPage.id, values)
        setPages(pages.map((p) => (p.id === editingPage.id ? updatedPage : p)))
        toast.success("Página atualizada com sucesso!")
      } else {
        const newPage = await createPage(values)
        setPages([...pages, newPage])
        toast.success("Página criada com sucesso!")
      }
      form.reset()
      setEditingPage(null)
    } catch (error) {
      toast.error(editingPage ? "Erro ao atualizar página." : "Erro ao criar página.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeletePage(id: string) {
    try {
      await deletePage(id)
      setPages(pages.filter((page) => page.id !== id))
      toast.success("Página excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir página.")
      console.error(error)
    }
  }

  function handleEditPage(page: Page) {
    setEditingPage(page)
    form.reset(page)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Páginas</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Página</FormLabel>
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
                <FormLabel>Slug da Página</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo da Página</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowComments"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Permitir Comentários</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="header">Cabeçalho</SelectItem>
                    <SelectItem value="footer">Rodapé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : editingPage ? "Atualizar Página" : "Criar Página"}
          </Button>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Páginas Existentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead>Comentários</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>{page.title}</TableCell>
                <TableCell>{page.slug}</TableCell>
                <TableCell>{page.position === "header" ? "Cabeçalho" : "Rodapé"}</TableCell>
                <TableCell>{page.allowComments ? "Permitidos" : "Desabilitados"}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditPage(page)} className="mr-2">
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePage(page.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

