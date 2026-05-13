import { useAuthStore } from "@/stores/authStore";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import Logo from "./Logo";
import { LogOut, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { openMobile } = useSidebar();

  return (
    <header className="w-full bg-secondary border-b border-border">
      <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
          {!user || !openMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="text-foreground hidden min-[1000px]:block" />
                </TooltipTrigger>
                <TooltipContent side="bottom">Ouvrir le menu</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <Logo className="min-[1000px]:hidden" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="hidden min-[1000px]:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-all cursor-pointer">
                    {user.avatar_url ? (
                      <AvatarImage
                        src={user.avatar_url}
                        alt={`Avatar de ${user.username ?? "utilisateur"}`}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                        {user.username?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-destructive rounded-lg focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          )}

          {!user || !openMobile ? (
            <SidebarTrigger className="text-foreground min-[1000px]:hidden" />
          ) : null}
        </div>
      </div>
    </header>
  );
}
