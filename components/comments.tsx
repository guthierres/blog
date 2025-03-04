"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createComment, deleteComment } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

const commentSchema = z.object({
  content: z.string().min(1, "O comentário não pode estar vazio"),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface Comment {
  id: string
  content: string
  author: {
    name: string
  }
  created_at: string
}

interface CommentsProps {
  postId: string
  comments: Comment[]
  currentUser: {
    id: string
    role: "admin" | "moderator" | "user"
  } | null
}

export default function Comments({ postId, comments: initialComments, currentUser }: CommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(values: CommentFormValues) {
    if (!currentUser) {
      toast.error("Você precisa estar logado para comentar.")
      return
    }

    try {
      setIsSubmitting(true)
      const newComment = await createComment(postId, values.content)
      setComments([newComment, ...comments])
      form.reset()
      toast.success("Comentário adicionado com sucesso!")
    } catch (error) {
      toast.error("Erro ao adicionar comentário.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteComment(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
      toast.success("Comentário excluído com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir comentário.")
      console.error(error)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comentários</h2>

      {currentUser && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu comentário</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar comentário"}
            </Button>
          </form>
        </Form>
      )}

      {comments.length === 0 ? (
        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</p>
                </div>
                {(currentUser?.id === comment.author.id ||
                  currentUser?.role === "admin" ||
                  currentUser?.role === "moderator") && (
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                    Excluir
                  </Button>
                )}
              </div>
              <p className="mt-2">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

