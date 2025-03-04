"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateSiteConfig } from "@/lib/actions"
import { toast } from "sonner"
import { ColorPicker } from "@/components/ui/color-picker"

const siteConfigSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  logo: z.string().optional(),
  showLogo: z.boolean().default(false),
  primaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  buttonColor: z.string(),
  sidebar: z.object({
    showAbout: z.boolean().default(true),
    aboutTitle: z.string().default("Sobre"),
    aboutContent: z.string().default("Bem-vindo ao meu blog!"),
    showCategories: z.boolean().default(true),
    categoriesTitle: z.string().default("Categorias"),
    showRecentPosts: z.boolean().default(true),
    recentPostsTitle: z.string().default("Posts Recentes"),
  }),
  footer: z.object({
    copyright: z.string().default(""),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    socialLinks: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
  }),
})

type SiteConfigFormValues = z.infer<typeof siteConfigSchema>

interface SiteConfigFormProps {
  initialData: SiteConfigFormValues
}

export default function SiteConfigForm({ initialData }: SiteConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SiteConfigFormValues>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: initialData,
  })

  const {
    fields: footerLinkFields,
    append: appendFooterLink,
    remove: removeFooterLink,
  } = useFieldArray({
    control: form.control,
    name: "footer.links",
  })

  const {
    fields: socialLinkFields,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: form.control,
    name: "footer.socialLinks",
  })

  async function onSubmit(values: SiteConfigFormValues) {
    try {
      setIsSubmitting(true)
      await updateSiteConfig(values)
      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar as configurações.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="sidebar">Barra Lateral</TabsTrigger>
            <TabsTrigger value="footer">Rodapé</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Blog</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Este título será exibido no cabeçalho do site.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Logo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>URL da imagem do logo do seu blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showLogo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mostrar Logo</FormLabel>
                    <FormDescription>Exibir o logo em vez do título no cabeçalho.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="colors" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Primária</FormLabel>
                  <FormControl>
                    <ColorPicker {...field} />
                  </FormControl>
                  <FormDescription>Cor principal do tema do blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo</FormLabel>
                  <FormControl>
                    <ColorPicker {...field} />
                  </FormControl>
                  <FormDescription>Cor de fundo do blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Texto</FormLabel>
                  <FormControl>
                    <ColorPicker {...field} />
                  </FormControl>
                  <FormDescription>Cor principal do texto do blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buttonColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor dos Botões</FormLabel>
                  <FormControl>
                    <ColorPicker {...field} />
                  </FormControl>
                  <FormDescription>Cor dos botões do blog.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="sidebar" className="space-y-6 pt-4">
            {/* Sidebar content (unchanged) */}
          </TabsContent>

          <TabsContent value="footer" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="footer.copyright"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto de Copyright</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>
                    Texto de copyright exibido no rodapé. Deixe em branco para usar o padrão.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-2">Links do Rodapé</h3>
              {footerLinkFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <Input {...form.register(`footer.links.${index}.label`)} placeholder="Rótulo" />
                  <Input {...form.register(`footer.links.${index}.url`)} placeholder="URL" />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeFooterLink(index)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendFooterLink({ label: "", url: "" })}
              >
                Adicionar Link
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Links de Redes Sociais</h3>
              {socialLinkFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <Input {...form.register(`footer.socialLinks.${index}.platform`)} placeholder="Plataforma" />
                  <Input {...form.register(`footer.socialLinks.${index}.url`)} placeholder="URL" />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeSocialLink(index)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSocialLink({ platform: "", url: "" })}
              >
                Adicionar Rede Social
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>
    </Form>
  )
}

