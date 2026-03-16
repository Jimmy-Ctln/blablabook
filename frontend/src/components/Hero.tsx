import { ArrowRight, BookOpen, LogIn, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import background from "@/assets/hero-bg.jpg";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Hero() {
  const currentUser = useCurrentUser();

  const isAuthenticated = currentUser.isAuthenticated;
  const username = currentUser.data?.username;

  return (
    <section className="relative h-screen">
      <div className="bg-black/50">
        <img
          src={background}
          alt=""
          className="absolute inset-0 object-cover h-full w-full"
        />
      </div>
      <div className="relative z-10 px-4 sm:px-8 lg:px-10 flex h-full gap-4 sm:gap-8 flex-col items-center sm:items-start text-center pt-16 sm:text-left sm:justify-start">
        <div className="flex items-center border rounded-full gap-2 p-2 font-bold mt-0 sm:mt-20 text-primary text-xs sm:text-sm">
          <Sparkles width={16} className="shrink-0" />
          <span>
            {isAuthenticated
              ? `Bienvenue sur Blablabook, ${username} !`
              : "Votre prochaine aventure litteraire commence ici"}
          </span>
        </div>
        {isAuthenticated ? (
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white">
            Bonjour, <span className="text-primary">{username}</span>
            <br />
            Que lit-on aujourd'hui ?
          </h1>
        ) : (
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white">
            Lisez. <span className="text-primary">Collectionnez.</span>
            <br />
            Partagez.
          </h1>
        )}
        <p className="mt-2 sm:mt-4 text-base sm:text-xl text-white/90 w-full sm:w-2/3 lg:w-1/2">
          {isAuthenticated
            ? "Retrouvez votre bibliotheque, suivez vos lectures en cours et decouvrez de nouvelles aventures litteraires."
            : "Blablabook est votre bibliotheque personnelle en ligne. Decouvrez des livres, suivez vos lectures et explorez les collections de la communaute."}
        </p>
        <div className="mt-4 sm:mt-10 flex flex-col w-full sm:w-auto gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Link
              to="/library"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
            >
              <BookOpen className="h-4 w-4" />
              Ma Bibliotheque
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
            >
              Se connecter
              <LogIn className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
