import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const background = "/hero-bg.jpg";

export default function Hero() {
  const currentUser = useCurrentUser();
  const isAuthenticated = currentUser.isAuthenticated;
  const username = currentUser.data?.username;

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/hero-bg.webp" type="image/webp" />
          <img
            src={background}
            alt=""
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 object-cover h-full w-full"
          />
        </picture>
        <div className="absolute inset-0 bg-linear-to-r from-[rgba(10,12,20,0.95)] via-[rgba(10,12,20,0.75)] to-[rgba(10,12,20,0.45)]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pt-10 pb-40">
        <div className="flex flex-col items-center gap-10 min-[1000px]:flex-row min-[1000px]:items-center min-[1000px]:gap-20 min-[1000px]:max-w-7xl min-[1000px]:mx-auto">

          <div className="flex flex-col items-center text-center min-[1000px]:items-start min-[1000px]:text-left min-[1000px]:flex-1 min-[1000px]:max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs sm:text-sm text-primary">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="font-medium">
                {isAuthenticated
                  ? `Bienvenue sur Blablabook, ${username} !`
                  : "Votre prochaine aventure littéraire commence ici"}
              </span>
            </div>

            {isAuthenticated ? (
              <h1 className="text-balance font-bold leading-tight tracking-tight text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Bonjour,{" "}
                <span className="text-primary">{username}</span>
                <br />
                Que lit-on aujourd'hui ?
              </h1>
            ) : (
              <h1 className="text-balance font-bold leading-tight tracking-tight text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Lisez.{" "}
                <span className="bg-linear-to-r rounded-xl px-2 from-primary to-blue-300">
                  Collectionnez.
                </span>
                <br />
                Partagez.
              </h1>
            )}

            <p className="mt-6 text-balance text-sm sm:text-base md:text-lg leading-relaxed text-white/70 max-w-lg">
              {isAuthenticated
                ? "Retrouvez votre bibliothèque, suivez vos lectures en cours et découvrez de nouvelles aventures littéraires."
                : "Blablabook est votre bibliothèque personnelle en ligne. Découvrez des livres, suivez vos lectures et explorez les collections de la communauté."}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row min-[1000px]:items-start">
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
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
                >
                  <span>Commencer dès maintenant</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                </Link>
              )}
            </div>
          </div>

          <div className="hidden min-[1000px]:flex justify-center items-center shrink-0">
            <div
              className="relative"
              style={{ animation: "hero-float 6s ease-in-out infinite" }}
            >
              <div
                className="absolute -inset-8 bg-radial from-primary/40 via-blue-500/20 to-transparent rounded-full blur-3xl"
                style={{ animation: "hero-glow 4s ease-in-out infinite" }}
              />
              <img
                src="/book.svg"
                alt="Logo Blablabook"
                className="relative w-56 h-56 min-[1200px]:w-72 min-[1200px]:h-72"
                style={{ animation: "hero-shadow 4s ease-in-out infinite" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
