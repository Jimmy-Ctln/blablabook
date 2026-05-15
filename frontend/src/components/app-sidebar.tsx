import * as React from "react";
import { Home, Book, LogIn, Loader2, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { Link, useNavigate } from "@tanstack/react-router";
import UserCard from "./user-card";
import Logo from "./Logo";
import { useUserBooks } from "@/hooks/useUserBooks";
import type { BookStatus } from "@/@types/books";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: currentUser, isLoading, isError } = useCurrentUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const [loadedImages, setLoadedImages] = React.useState<
    Record<string, boolean>
  >({});

  const STATUSBOOK: BookStatus = "En cours";

  const userId = currentUser?.id;

  const { books: BookRow } = useUserBooks(userId);

  const inProgressBooks = BookRow.filter(
    (inProgressBook) => inProgressBook.status === STATUSBOOK,
  );

  const isAuthenticated = !!currentUser && !isError;

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleClick = (bookIsbn: string) => {
    closeMobileSidebar();
    navigate({ to: `/books/${bookIsbn}` });
  };

  const handleLoginClick = () => {
    closeMobileSidebar();
    navigate({ to: "/login" });
  };

  const handleImageLoad = (bookId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [bookId]: true,
    }));
  };

  const items = {
    navMain: [
      {
        title: "Accueil",
        url: "/",
        icon: Home,
      },
      {
        title: "Ma bibliothèque",
        url: "/library",
        icon: Book,
        visible: isAuthenticated,
      },
    ],
  };

  const visibleNavItems = items.navMain.filter(
    (item) => item.visible !== false,
  );

  return (
    <Sidebar
      className="px-3 sm:px-4 bg-secondary supports-backdrop-filter:bg-secondary/95 backdrop-blur-xl"
      side={isMobile ? "right" : "left"}
      {...props}
    >
      <SidebarHeader className="mt-4 sm:mt-6 gap-4">
        <div
          onClick={closeMobileSidebar}
          className="items-center gap-2 text-foreground font-bold hover:opacity-80 transition-opacity cursor-pointer hidden sm:flex"
        >
          <Logo />
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-4 sm:mt-6 flex flex-col gap-6">
        <div>
          <SidebarMenuItem className="opacity-50 text-xs font-semibold mb-3 uppercase tracking-wide">
            Menu
          </SidebarMenuItem>
          <NavMain items={visibleNavItems} onItemClick={closeMobileSidebar} />
        </div>

        {isAuthenticated && inProgressBooks.length > 0 && (
          <>
            <Separator className="my-2" />
            <div>
              <SidebarMenuItem className="opacity-50 text-xs font-semibold mb-3 uppercase tracking-wide">
                En cours de lecture
              </SidebarMenuItem>
              <div className="flex flex-col gap-2 w-full">
                {inProgressBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group flex gap-2 sm:gap-3 items-start cursor-pointer rounded-lg p-2 transition-colors duration-200 hover:bg-primary/10"
                    onClick={() => handleClick(book.isbn)}
                  >
                    <div className="relative w-8 h-12 sm:w-10 sm:h-14 shrink-0">
                      {!loadedImages[book.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-md">
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <img
                        src={book.cover}
                        onLoad={() => handleImageLoad(book.id)}
                        className={`w-8 h-12 sm:w-10 sm:h-14 object-cover rounded-md shadow-sm group-hover:shadow-md transition-all duration-200 ${
                          !loadedImages[book.id] ? "opacity-0" : "opacity-100"
                        }`}
                        alt={book.name}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 justify-start">
                      <span className="text-xs sm:text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {book.name}
                      </span>
                      {book.author && (
                        <span className="text-xs text-muted-foreground truncate">
                          {book.author}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isAuthenticated && inProgressBooks.length === 0 && (
          <>
            <Separator className="my-2" />
            <div className="text-center py-4 px-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Aucun livre en cours. Commencez à lire ! 📚
              </p>
              <Link
                to="/library"
                onClick={closeMobileSidebar}
                className="text-xs sm:text-sm text-primary hover:underline mt-2 inline-block"
              >
                Voir votre bibliothèque
              </Link>
            </div>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="mb-3 sm:mb-4 gap-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
          <span>{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>
        </button>
        <Separator />
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : isAuthenticated ? (
          <UserCard />
        ) : (
          <>
            <Separator />
            <Button
              onClick={handleLoginClick}
              className="w-full rounded-lg gap-2"
              size="sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Se connecter</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
