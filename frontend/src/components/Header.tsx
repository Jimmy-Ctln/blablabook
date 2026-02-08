import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const themes = [
    {
      title: "Tout",
    },
    {
      title: "Fantasy & Magie",
    },
    {
      title: "Amour",
    },
    {
      title: "Horreur",
    },
  ];

  return (
    <header className="bg-background flex h-24 items-center border-b px-4">
      <SidebarTrigger className="mr-4" />
      <div className="flex gap-2">
        {themes.map((theme) => (
          <Button variant={"outline"}>{theme.title}</Button>
        ))}
      </div>
      <div className="flex-2 flex justify-center">
        <SearchBar onSearch={setSearch} />
      </div>
      {user ? (
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
    </header>
  );
}
