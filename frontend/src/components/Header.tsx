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
    <header className="flex h-20 justify-between bg-secondary items-center px-4">
      <SidebarTrigger className="hidden md:flex mr-4 text-foreground" />
      <Link
        to="/"
        className="flex md:hidden items-center gap-2 text-foreground text-lg font-semibold"
      >
        <BookOpen className="w-5 h-5" />
        Blablabook
      </Link>
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" asChild>
                  <Avatar className="w-10 h-10 border-2 bg-foreground hover:border-primary transition-all">
                    <AvatarImage
                      key={user.image}
                      src={user.image ? `${user.image}` : undefined}
                      alt={`Avatar de ${user.username || "X"}`}
                    />
                    <AvatarFallback className="bg-bookbeige/50">
                      {user.username ? user.username[0].toUpperCase() : "X"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className={`cursor-pointer`}
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
            </div>
          ) : (
            <Link to="/login" className="">
              <Button>Se connecter</Button>
            </Link>
          )}
        </div>
        {/* Mobile : trigger à droite */}
        <SidebarTrigger
          className={`md:hidden text-foreground bg-secondary/90 hover:bg-secondary ${openMobile ? "hidden" : "inline-flex"}`}
        />
      </div>
    </header>
  );
}
