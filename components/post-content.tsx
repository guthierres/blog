"use client"

import { useState } from "react"
import { Facebook, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { likePost } from "@/lib/actions"
import Comments from "@/components/comments"

interface PostContentProps {
  post: {
    id: string
    title: string
    content: string
    created_at: string
    cover_image?: string
    likes: number
    allow_comments: boolean
  }
  currentUser: {
    id: string
    role: "admin" | "moderator" | "user"
  } | null
}

export default function PostContent({ post, currentUser }: PostContentProps) {
  const [likes, setLikes] = useState(post.likes)

  const handleLike = async () => {
    if (!currentUser) return
    const result = await likePost(post.id)
    if (result.success) {
      setLikes(result.likes)
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
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

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={handleLike} variant="outline" size="sm" disabled={!currentUser}>
            <Heart className={`mr-2 h-4 w-4 ${likes > 0 ? "fill-current text-red-500" : ""}`} />
            {likes}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}>
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {post.allow_comments && <Comments postId={post.id} currentUser={currentUser} />}
    </article>
  )
}

