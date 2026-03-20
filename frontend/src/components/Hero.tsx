import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import background from "@/assets/hero-bg.jpg";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Hero() {
  const currentUser = useCurrentUser();
  const isAuthenticated = currentUser.isAuthenticated;
  const username = currentUser.data?.username;

  return (
    <section className="relative flex min-h-[70vh] items-start justify-start pt-16 sm:pt-20 md:pt-24 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={background}
          alt=""
          className="absolute inset-0 object-cover h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[rgba(10,12,20,0.95)] via-[rgba(10,12,20,0.8)] to-[rgba(10,12,20,0.5)]" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-[rgba(10,12,20,0.6)]" />
      </div>

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 pb-16 sm:pb-20">
        <div className="max-w-3xl">
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs sm:text-sm text-primary">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              {isAuthenticated
                ? `Bienvenue sur Blablabook, ${username} !`
                : "Votre prochaine aventure littéraire commence ici"}
            </span>
          </div>

          {isAuthenticated ? (
            <h1 className="text-balance font-bold leading-tight tracking-tight text-white text-xl sm:text-5xl md:text-6xl lg:text-7xl">
              Bonjour,{" "}
              <span className="text-primary to-blue-300">{username}</span>
              <br />
              Que lit-on aujourd'hui ?
            </h1>
          ) : (
            <h1 className="text-balance font-bold leading-tight tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Lisez.{" "}
              <span className="bg-linear-to-r from-primary to-blue-300">
                Collectionnez.
              </span>
              <br />
              Partagez.
            </h1>
          )}

          <p className="mt-4 sm:mt-6 max-w-lg text-balance text-sm sm:text-base md:text-lg leading-relaxed text-white/70">
            {isAuthenticated
              ? "Retrouvez votre bibliothèque, suivez vos lectures en cours et découvrez de nouvelles aventures littéraires."
              : "Blablabook est votre bibliothèque personnelle en ligne. Découvrez des livres, suivez vos lectures et explorez les collections de la communauté."}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row">
            {isAuthenticated ? (
              <Link
                to="/library"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Ma Bibliothèque</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
              >
                <span>Se connecter</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
