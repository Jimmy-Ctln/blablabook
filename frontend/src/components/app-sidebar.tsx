import * as React from "react";
import { BookOpen, Home, Book } from "lucide-react";
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
import { useUserBooks } from "@/hooks/useUserBooks";
import type { BookStatus } from "@/@types/books";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const STATUSBOOK: BookStatus = "En cours";

  const userId = currentUser.data?.id;

  const { books: BookRow } = useUserBooks(userId);

  const inProgressBooks = BookRow.filter(
    (inProgressBook) => inProgressBook.status === STATUSBOOK,
  );

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleClick = (bookIsbn: string) => {
    closeMobileSidebar();
    navigate({ to: `/books/${bookIsbn}` });
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
      },
    ],
  };

  return (
    <Sidebar
      className="px-4 bg-secondary supports-backdrop-filter:bg-secondary/95 backdrop-blur-xl"
      side={isMobile ? "right" : "left"}
      {...props}
    >
      <SidebarHeader className="mt-6 gap-6">
        <Link
          to="/"
          onClick={closeMobileSidebar}
          className="text-2xl cursor-pointer flex items-center gap-2"
        >
          <div className="flex items-center gap-2 text-foreground">
            <BookOpen />
            Blablabook
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <SidebarMenuItem className="opacity-50">MENU</SidebarMenuItem>
        <NavMain items={items.navMain} onItemClick={closeMobileSidebar} />
        {currentUser.isAuthenticated && (
          <SidebarMenuItem className="opacity-50 mt-4">
            EN COURS
          </SidebarMenuItem>
        )}
        <div className="flex flex-col gap-3 w-full mt-2">
          {currentUser.isAuthenticated &&
            inProgressBooks.map((book) => (
              <div
                key={book.id}
                className="group flex gap-3 items-center cursor-pointer rounded-xl p-2 transition-colors duration-200 hover:bg-accent overflow-hidden"
                onClick={() => handleClick(book.isbn)}
              >
                <img
                  src={book.cover}
                  className="w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                  alt={book.name}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium leading-tight line-clamp-2 text-foreground hover:text-primary">
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
      </SidebarContent>
      <SidebarFooter className="mb-4 text-foreground">
        <UserCard />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
