import Link from "next/link"
import Image from "next/image" // Import Image component
import { Github, Linkedin, Mail, Phone, MapPin, ShieldCheck, FileText } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/sangam-kunwar-14b89834a/",
      label: "LinkedIn",
    },
    { icon: Github, href: "https://github.com/sangamkunwar-dv", label: "GitHub" },
    { icon: Mail, href: "mailto:sangamkunwae48@gmail.com", label: "Email" },
  ]

  return (
    <footer id="contact" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          
          {/* Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Replace '/logo.png' with your actual logo path */}
              <Image 
                src="/sangamkunwarphoto.png" 
                alt="Sangam Kunwar Logo" 
                width={40} 
                height={40} 
                className="rounded-lg object-contain"
              />
              <h3 className="text-lg font-bold text-primary">Sangam Kunwar</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full-stack developer building beautiful digital experiences with modern web technologies.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:info@sangamkunwar.com.np" className="hover:text-foreground transition-colors">
                  info@sangamkunwar.com.np
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <a href="tel:+9779701024066" className="hover:text-foreground transition-colors">
                  +977 9701024066
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>Tilottama-8, Rupandehi, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Sangam Kunwar. All rights reserved.</p>
          
          {/* Privacy & Legal Section */}
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <ShieldCheck size={14} />
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <FileText size={14} />
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}