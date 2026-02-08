import { Mail, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logo from "@/assets/Blablabook-svg.svg";

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t bg-primary text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo et nom */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <img src={logo} className="w-10 h-10" alt="Logo Blablabook" />
              <span className="text-xl font-semibold text-secondary tracking-wide">
                Blablabook
              </span>
            </div>
            <p className="text-sm text-white/70 text-center md:text-left max-w-xs">
              Votre bibliothèque personnelle en ligne
            </p>
          </div>
          {/* Navigation / Liens */}
          <nav className="flex flex-wrap items-center gap-3 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="mailto:contact@blablabook.com">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Contact</span>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Envoyer un mail</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/cgu">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">CGU</span>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Conditions générales d’utilisation
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/confidentialite">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Confidentialité</span>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Politique de confidentialité</TooltipContent>
            </Tooltip>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-white/70 text-center md:text-right">
            © {new Date().getFullYear()} Blablabook
            <br />
            <span className="text-xs">Tous droits réservés</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
