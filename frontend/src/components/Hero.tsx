import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="relative bg-[url('./assets/hero-bg.jpg')] h-screen">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-10 flex h-full gap-8 flex-col items-start text-center">
        <div className="flex items-center border rounded-full gap-2 p-2 font-bold text-left mt-20 text-secondary">
          <Sparkles width={20} />
          Votre prochaine aventure litteraire commence ici
        </div>
        <h1 className="text-7xl font-bold text-left text-white">
          Lisez. Collectionnez. <br />
          Partagez.
        </h1>
        <p className="mt-4 text-xl text-left text-white/90 w-1/2">
          Blablabook est votre bibliotheque personnelle en ligne. Decouvrez des
          livres, suivez vos lectures et explorez les collections de la
          communaute.
        </p>
        <div className="flex gap-4">
          <Button className="p-8">
            <Link to="/library" className="flex items-center gap-2">
              <BookOpen />
              Ma Bibliothèque
              <ArrowRight />
            </Link>
          </Button>
          <Button className="p-8">
            <Link to="/community" className="flex items-center gap-2">
              <BookOpen />
              Explorer la Communauté
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
