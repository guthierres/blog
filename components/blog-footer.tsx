import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

interface FooterLink {
  label: string
  url: string
}

interface SocialLink {
  platform: string
  url: string
}

interface Page {
  title: string
  slug: string
}

interface BlogFooterProps {
  copyright: string
  links: FooterLink[]
  socialLinks: SocialLink[]
  footerPages: Page[]
}

export default function BlogFooter({ copyright, links, socialLinks, footerPages }: BlogFooterProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "twitter":
      case "x":
        return <Twitter className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {copyright || `© ${new Date().getFullYear()} Meu Blog. Todos os direitos reservados.`}
          </div>

          <nav className="flex gap-4">
            {links.map((link, index) => (
              <Link key={index} href={link.url} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
            {footerPages.map((page) => (
              <Link
                key={page.slug}
                href={`/pages/${page.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

