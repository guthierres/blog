"use server"

import { db } from "@/lib/db"

export async function getSiteConfig() {
  try {
    const config = await db.siteConfig.findFirst()

    if (!config) {
      // Criar configuração padrão se não existir
      return {
        title: "Meu Blog",
        logo: "",
        showLogo: false,
        sidebar: {
          showAbout: true,
          aboutTitle: "Sobre",
          aboutContent: "Bem-vindo ao meu blog!",
          showCategories: true,
          categoriesTitle: "Categorias",
          categories: [],
          showRecentPosts: true,
          recentPostsTitle: "Posts Recentes",
          recentPosts: [],
        },
        footer: {
          copyright: "",
          links: [],
          showSocial: true,
          socialLinks: [],
        },
      }
    }

    return config
  } catch (error) {
    console.error("Erro ao buscar configurações do site:", error)

    // Retornar configuração padrão em caso de erro
    return {
      title: "Meu Blog",
      logo: "",
      showLogo: false,
      sidebar: {
        showAbout: true,
        aboutTitle: "Sobre",
        aboutContent: "Bem-vindo ao meu blog!",
        showCategories: true,
        categoriesTitle: "Categorias",
        categories: [],
        showRecentPosts: true,
        recentPostsTitle: "Posts Recentes",
        recentPosts: [],
      },
      footer: {
        copyright: "",
        links: [],
        showSocial: true,
        socialLinks: [],
      },
    }
  }
}

