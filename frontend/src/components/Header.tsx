import { useAuthStore } from "@/stores/authStore";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import Logo from "./Logo";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const { openMobile } = useSidebar();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="w-full bg-secondary border-b border-border">
      <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
          {!user || !openMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="text-foreground hidden sm:block" />
                </TooltipTrigger>
                <TooltipContent side="bottom">Ouvrir le menu</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <Logo className="sm:hidden" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent transition-colors"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            ) : (
              <Sun className="h-5 w-5 sm:h-7 sm:w-7" />
            )}
          </button>
          {!user || !openMobile ? (
            <SidebarTrigger className="text-foreground sm:hidden" />
          ) : null}
        </div>
      </div>
    </header>
  );
}
