import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MoveRight } from "lucide-react";

export default function Hero() {
  const { isAuthenticated = false } = useCurrentUser();

  const title = isAuthenticated
    ? "Ravi de vous retrouver !"
    : "Explorez, lisez et partagez vos coups de cœur";

  const paragraph = isAuthenticated
    ? "Quel livre allez-vous découvrir aujourd’hui ?"
    : "Créez votre bibliothèque, explorez de nouveaux ouvrages et échangez avec une communauté de passionnés.";

  const link = isAuthenticated ? "/library" : "/login";

  const actionButton = isAuthenticated
    ? "Accéder à ma bibliothèque"
    : "Commencer l’aventure";

  return (
    <section className="w-full mt-2 px-2">
      <div className="w-full py-8 rounded-xl shadow-xl bg-card flex flex-col items-center bg-chart-2">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 text-foreground">
          {title}
        </h1>
        <p className="text-center mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-xl lg:text-2xl text-base sm:text-lg md:text-xl text-muted-foreground">
          {paragraph}
        </p>
        <Link to={link} className="w-full flex justify-center">
          <Button
            size="lg"
            className="w-[80%] sm:w-auto whitespace-normal text-center mt-2"
          >
            <div className="flex items-center gap-2 font-bold">
              {actionButton}
              <MoveRight />
            </div>
          </Button>
        </Link>
      </div>
    </section>
  );
}
