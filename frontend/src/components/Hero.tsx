import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import background from "@/assets/hero-bg.jpg";

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className=" bg-black/50">
        <img
          src={background}
          alt=""
          className=" absolute inset-0 object-cover h-full w-full"
        />
      </div>
      <div className="relative z-10 px-10 flex h-full gap-8 flex-col items-start text-center">
        <div className="flex items-center border rounded-full gap-2 p-2 font-bold text-left mt-20 text-primary">
          <Sparkles width={20} />
          Votre prochaine aventure litteraire commence ici
        </div>
        <h1 className="text-7xl font-bold text-left text-white">
          Lisez. <span className="text-primary">Collectionnez.</span>
          <br />
          Partagez.
        </h1>
        <p className="mt-4 text-xl text-left text-white/90 w-1/2">
          Blablabook est votre bibliotheque personnelle en ligne. Decouvrez des
          livres, suivez vos lectures et explorez les collections de la
          communaute.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/library"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/90 px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)]"
          >
            <BookOpen className="h-4 w-4" />
            Ma Bibliotheque
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/community"
            className="glass-strong inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            Explorer la Communaute
          </Link>
        </div>
      </div>
    </section>
  );
}
