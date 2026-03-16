import * as React from "react";
import { BookOpen, Home, Book } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { Link, useNavigate } from "@tanstack/react-router";
import UserCard from "./user-card";
import { useUserBooks } from "@/hooks/useUserBooks";
import type { BookStatus } from "@/@types/books";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const STATUSBOOK: BookStatus = "En cours";

  const userId = currentUser.data?.id;

  const { books: BookRow } = useUserBooks(userId);

  const inProgressBooks = BookRow.filter(
    (inProgressBook) => inProgressBook.status === STATUSBOOK,
  );

  const handleClick = (bookIsbn: string) => {
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
    <Sidebar className="px-4 bg-secondary" {...props}>
      <SidebarHeader className="mt-6 gap-6">
        <Link
          to="/"
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
        <NavMain items={items.navMain} />
        {currentUser.isAuthenticated && (
          <SidebarMenuItem className="opacity-50 mt-4">
            EN COURS
          </SidebarMenuItem>
        )}
        <div className="flex flex-col gap-8 w-full mx-auto mt-2">
          {inProgressBooks.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 items-center cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleClick(book.isbn)}
            >
              <img
                src={book.cover}
                className="w-12 h-auto rounded-2xl"
                alt=""
              />
              <div>
                <span>{book.name}</span>
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
