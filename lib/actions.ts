"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updateSiteConfig(data: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("site_config").update(data).eq("id", data.id)

    if (error) throw error

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return { success: false, error }
  }
}

export async function createPost(data: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { error } = await supabase.from("posts").insert({
      ...data,
      author_id: userData.user.id,
    })

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return { success: false, error }
  }
}

export async function updatePost(id: string, data: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("posts").update(data).eq("id", id)

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath(`/posts/${data.slug}`)
    return { success: true }
  } catch (error) {
    console.error(`Erro ao atualizar post ${id}:`, error)
    return { success: false, error }
  }
}

export async function deletePost(id: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir post ${id}:`, error)
    return { success: false, error }
  }
}

export async function createComment(postId: string, content: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content: content,
        post_id: postId,
        author_id: userData.user.id,
      })
      .select(`
        id,
        content,
        created_at,
        author:users(name)
      `)
      .single()

    if (error) throw error

    revalidatePath(`/posts/${postId}`)
    return comment
  } catch (error) {
    console.error("Erro ao criar comentário:", error)
    throw error
  }
}

export async function deleteComment(commentId: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("comments").delete().eq("id", commentId)

    if (error) throw error

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir comentário ${commentId}:`, error)
    return { success: false, error }
  }
}

export async function likePost(postId: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from("post_likes")
      .upsert({ post_id: postId, user_id: userData.user.id }, { onConflict: "post_id,user_id" })
      .select("post_id")

    if (error) throw error

    const { data: postData, error: postError } = await supabase.from("posts").select("likes").eq("id", postId).single()

    if (postError) throw postError

    return { success: true, likes: postData.likes }
  } catch (error) {
    console.error(`Erro ao curtir o post ${postId}:`, error)
    return { success: false, error }
  }
}

export async function createCategory(data: { name: string; slug: string }) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: category, error } = await supabase.from("categories").insert(data).select().single()

    if (error) throw error

    revalidatePath("/admin")
    return category
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir categoria ${id}:`, error)
    return { success: false, error }
  }
}

export async function createTag(data: { name: string; slug: string }) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: tag, error } = await supabase.from("tags").insert(data).select().single()

    if (error) throw error

    revalidatePath("/admin")
    return tag
  } catch (error) {
    console.error("Erro ao criar tag:", error)
    throw error
  }
}

export async function deleteTag(id: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("tags").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir tag ${id}:`, error)
    return { success: false, error }
  }
}

export async function createPage(data: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: page, error } = await supabase.from("pages").insert(data).select().single()

    if (error) throw error

    revalidatePath("/admin")
    return page
  } catch (error) {
    console.error("Erro ao criar página:", error)
    throw error
  }
}

export async function updatePage(id: string, data: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: page, error } = await supabase.from("pages").update(data).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/admin")
    revalidatePath(`/pages/${data.slug}`)
    return page
  } catch (error) {
    console.error(`Erro ao atualizar página ${id}:`, error)
    throw error
  }
}

export async function deletePage(id: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase.from("pages").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir página ${id}:`, error)
    return { success: false, error }
  }
}

export async function getPages() {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: pages, error } = await supabase.from("pages").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return pages
  } catch (error) {
    console.error("Erro ao buscar páginas:", error)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: page, error } = await supabase.from("pages").select("*").eq("slug", slug).single()

    if (error) throw error

    return page
  } catch (error) {
    console.error(`Erro ao buscar página com slug ${slug}:`, error)
    return null
  }
}

