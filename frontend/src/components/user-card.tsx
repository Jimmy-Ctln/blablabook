import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function UserCardButton(
  props: React.ComponentProps<typeof Button>,
) {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <Button
      asChild
      variant="ghost"
      className="glass cursor-pointer rounded-2xl max-h-18 flex items-center h-16 w-full p-0"
      {...props}
    >
      <Link to="/profile" className="w-full">
        <div className="flex items-center gap-4 p-4 w-full">
          <Avatar className="w-10 h-10 border-2 bg-foreground hover:border-primary transition-all">
            {user.image ? (
              <AvatarImage
                src={`${user.image}`}
                alt={`Avatar de ${user.username ?? "X"}`}
              />
            ) : (
              <AvatarFallback className="bg-bookbeige/50">
                {user.username?.[0]?.toUpperCase() ?? "X"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col">
            <span>{user.username}</span>
            <span className="text-muted-foreground text-sm">Mon profil</span>
          </div>
        </div>
      </Link>
    </Button>
  );
}
