import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/assets/Blablabook-svg.svg";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { location } = useRouterState();

  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path ? "font-bold text-secondary" : "";

  return (
    <header className="px-4 py-4 text-white bg-primary shadow-md relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bookochre rounded-lg transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} className="w-12 h-12" alt="Logo Blablabook" />
            <span className="text-2xl font-semibold text-secondary tracking-wide">
              Blablabook
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Navigation principale"
        >
          <Link
            to="/"
            className={`text-base hover:text-secondary transition-colors ${isActive("/")}`}
          >
            Accueil
          </Link>
          {user ? (
            <>
              <Link
                to="/library"
                className={`text-base hover:text-secondary transition-colors ${isActive("/library")}`}
              >
                Ma bibliothèque
              </Link>
              <div className="hidden md:flex items-center ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer" asChild>
                    <Avatar className="w-10 h-10 border-2 border-bookbeige hover:border-secondary transition-all">
                      <AvatarImage
                        key={user.image}
                        src={user.image ? `/images/${user.image}` : undefined}
                        alt={`Avatar de ${user.username || "X"}`}
                      />
                      <AvatarFallback className="bg-bookbeige/50 border-bookbeige font-bold text-white">
                        {user.username ? user.username[0].toUpperCase() : "X"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className={`cursor-pointer ${isActive("/profile")}`}
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
            </>
          ) : (
            <Link to="/login">
              <Button className="text-base px-6 py-2 hover:scale-105 transition-transform">
                Se connecter
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile burger menu */}
        <div className="flex items-center md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bookochre rounded p-1"
                aria-label="Ouvrir le menu"
              >
                <Menu className="cursor-pointer w-7 h-7" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
                Accueil
              </DropdownMenuItem>
              {user ? (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/library" })}
                  >
                    Ma bibliothèque
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/profile" })}
                  >
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 font-semibold"
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate({ to: "/login" })}>
                  Se connecter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
