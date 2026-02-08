import React from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface BookAddActionProps {
  onAdd: () => void;
  isAdding: boolean;
}

export const BookAddAction: React.FC<BookAddActionProps> = ({ onAdd, isAdding }) => {
  return (
    <div className="bg-chart-2 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4 w-full">
      <div className="flex items-center gap-2 font-bold">
        <h3 className="font-semibold text-lg text-foreground font-sans">
          Intéressé par ce livre ?
        </h3>
      </div>

      <Button
        onClick={onAdd}
        disabled={isAdding}
        className="w-full h-12 text-md shadow-md hover:shadow-lg transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white font-sans"
      >
        {isAdding ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Heart className="mr-2 h-5 w-5 fill-transparent group-hover:fill-white transition-colors" />
        )}
        <span className="truncate">
          {isAdding ? "Ajout..." : "Ajouter à ma bibliothèque"}
        </span>
      </Button>
    </div>
  );
};