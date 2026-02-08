import * as React from "react";
import { Home, Book, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const store = useAuthStore();

  const logout = store.logout;

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
    general: [
      {
        title: "Se déconnecter",
        icon: LogOut,
        function: () => logout(),
      },
    ],
  };

  return (
    <Sidebar className="border-r-0 px-4" {...props}>
      <SidebarHeader className="mt-6">
        <Link to="/" className="text-3xl cursor-pointer">
          Blablabook
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <NavMain items={items.navMain} />
      </SidebarContent>
      <SidebarFooter className="mb-4">
        {items.general.map((general) => (
          <div className="flex items-center gap-2">
            <Button key={general.title}>
              <general.icon />
              {general.title}
            </Button>
          </div>
        ))}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
