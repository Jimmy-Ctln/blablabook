import React from "react";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";

interface BookLoginCTAProps {
  onClick: () => void;
}

export const BookLoginCTA: React.FC<BookLoginCTAProps> = ({ onClick }) => {
  return (
    <div className="w-[80%] sm:w-auto whitespace-normal font-sans text-center mt-2">
      <div className="flex items-center gap-2 font-bold">
        <h3>
          {"Intéressé par ce livre ?"}
        </h3> 
      </div>

      <Button
        onClick={onClick}
        className="w-full h-12 text-md shadow-md hover:shadow-lg transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white font-sans"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Connectez-vous pour l'ajouter
      </Button>
    </div>
  );
};