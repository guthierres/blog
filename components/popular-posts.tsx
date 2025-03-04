import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  title: string
  slug: string
  views: number
  likes: number
}

interface PopularPostsProps {
  mostViewed: Post[]
  mostLiked: Post[]
}

export default function PopularPosts({ mostViewed, mostLiked }: PopularPostsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Posts Mais Vistos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mostViewed.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title} ({post.views} visualizações)
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts Mais Curtidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mostLiked.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title} ({post.likes} curtidas)
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

