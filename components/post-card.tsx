import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  createdAt: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full flex flex-col">
      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <Link href={`/posts/${post.slug}`} className="hover:underline">
          <h3 className="text-xl font-bold">{post.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/posts/${post.slug}`}>Ler mais</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

