import { db } from "@/lib/db"

export async function getPosts() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
      },
    })

    return posts
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return []
  }
}

export async function getMostViewedPosts() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
      },
    })

    return posts
  } catch (error) {
    console.error("Erro ao buscar posts mais vistos:", error)
    return []
  }
}

export async function getMostLikedPosts() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        likes: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        likes: true,
      },
    })

    return posts
  } catch (error) {
    console.error("Erro ao buscar posts mais curtidos:", error)
    return []
  }
}

