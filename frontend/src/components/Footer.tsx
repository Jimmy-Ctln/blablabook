import { Lock, FileText, Instagram, Twitter } from "lucide-react";
import { Link } from "@tanstack/react-router";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Mentions Légales", href: "/legal", icon: FileText },
    { label: "Politique de Confidentialité", href: "/privacy", icon: Lock },
    { label: "Conditions d'Utilisation", href: "/terms", icon: FileText },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="w-full bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg text-foreground">
                Blablabook
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Votre bibliothèque personnelle en ligne
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-foreground mb-3 text-sm">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  À propos
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-foreground mb-3 text-sm">
              Légal
            </h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href as any}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-foreground mb-3 text-sm">
              Nous suivre
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    title={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="h-px bg-border mb-6" />
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
          <p>© {currentYear} Blablabook. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
