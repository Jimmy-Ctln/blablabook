import { Book } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-6 md:mt-10 min-h-[60vh] text-center px-4">
      <Book className="w-14 h-14 md:w-16 md:h-16 mb-4" aria-hidden="true" />
      <h1 className="text-2xl md:text-4xl font-bold mb-2">
        Oups, page introuvable!
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-6">
        Cette page n’existe pas dans la bibliothèque Blablabook.
        <br />
        Peut-être cherchez-vous un livre rare ou perdu ?
      </p>
      <Link to="/">
        <Button variant="default" size="lg">
          Retour à l’accueil
        </Button>
      </Link>
      <div className="mt-8 text-sm text-gray-400">
        <span>
          📚 Continuez à explorer et partagez vos lectures avec la communauté!
        </span>
      </div>
    </div>
  );
}
