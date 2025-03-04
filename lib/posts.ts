"use server"

import { db } from "@/lib/db"

export async function getPosts() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts
  } catch (error) {
    console.error("Erro ao buscar posts:", error)
    return []
  }
}

export async function getPostById(id: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        id,
      },
    })

    return post
  } catch (error) {
    console.error(`Erro ao buscar post com ID ${id}:`, error)
    return null
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        slug,
      },
    })

    return post
  } catch (error) {
    console.error(`Erro ao buscar post com slug ${slug}:`, error)
    return null
  }
}

