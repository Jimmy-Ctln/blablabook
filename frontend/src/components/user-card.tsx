import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserCardButton(
  props: React.ComponentProps<typeof Button>,
) {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="glass cursor-pointer rounded-2xl h-16 px-3 hover:bg-primary/10 transition-all"
          {...props}
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary transition-all">
              {user.avatar_url ? (
                <AvatarImage
                  src={`${user.avatar_url}`}
                  alt={`Avatar de ${user.username ?? "X"}`}
                />
              ) : (
                <AvatarFallback className="bg-primary text-foreground font-bold">
                  {user.username?.[0]?.toUpperCase() ?? ""}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-0 text-left">
              <span className="font-semibold text-sm text-foreground">
                {user.username}
              </span>
              <span className="text-xs text-muted-foreground">Mon compte</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
  );
}
