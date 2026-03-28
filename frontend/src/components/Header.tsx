import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { BookOpen } from "lucide-react";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openMobile } = useSidebar();

  const navigate = useNavigate();

  return (
    <header className="w-full bg-secondary border-b border-border">
      <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
          {!user || !openMobile ? (
            <SidebarTrigger className="text-foreground" />
          ) : null}
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground font-bold text-base sm:text-lg shrink-0"
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Blablabook</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hidden sm:flex cursor-pointer"
                  asChild
                >
                  <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-transparent hover:border-primary transition-all">
                    <AvatarImage
                      key={user.avatar_url}
                      src={user.avatar_url ? `${user.avatar_url}` : undefined}
                      alt={`Avatar de ${user.username || "X"}`}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
                      {user.username ? user.username[0].toUpperCase() : "X"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/profile" })}
                  >
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 font-semibold cursor-pointer"
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button size="sm">Se connecter</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
