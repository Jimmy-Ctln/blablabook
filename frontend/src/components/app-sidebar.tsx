import * as React from "react";
import {
  BookOpen,
  Users,
  Home,
  Settings,
  Compass,
  TrendingUp,
  Book,
  Share2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { Link } from "@tanstack/react-router";
import SearchBar from "./SearchBar";
import UserCard from "./user-card";
import { useUserBooks } from "@/hooks/useUserBooks";
import { mapBookRowToDisplay } from "@/lib/bookDisplayMapper";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const store = useAuthStore();
  const [search, setSearch] = React.useState("");

  const logout = store.logout;

  const rawUserBooks = useUserBooks();

  const userBooks = rawUserBooks.books.map(mapBookRowToDisplay);
  console.log(userBooks);

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
      {
        title: "Communaute",
        url: "/community",
        icon: Users,
      },
    ],
    discover: [
      {
        title: "Explorer",
        url: "/",
        icon: Compass,
      },
      {
        title: "Tendances",
        url: "/",
        icon: TrendingUp,
      },
      {
        title: "Ma biblio publique",
        url: "/",
        icon: Share2,
      },
    ],
    general: [
      {
        title: "Parametres",
        url: "/",
        icon: Settings,
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
        <SearchBar onSearch={setSearch} />
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <SidebarMenuItem className="opacity-50">MENU</SidebarMenuItem>
        <NavMain items={items.navMain} />
        <SidebarMenuItem className="opacity-50 mt-4">DECOUVRIR</SidebarMenuItem>
        <NavMain items={items.discover} />
        <SidebarMenuItem className="opacity-50 mt-4">EN COURS</SidebarMenuItem>
        <div>
          {userBooks.map((book) => (
            <div>
              <img src={book.cover} alt="" />
              <div>
                <span>{book.title}</span>
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
