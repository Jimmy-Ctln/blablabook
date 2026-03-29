import React from "react";

interface BookSummaryProps {
  description?: string;
}

export const BookSummary: React.FC<BookSummaryProps> = ({ description }) => {
  return (
    <div className="w-full pt-6">
      <h3 className="text-xl mb-2 text-foreground font-sans">Résumé</h3>
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground font-sans leading-relaxed whitespace-pre-line">
        {description || (
          <span className="italic opacity-70">
            Aucune description fournie par l'éditeur.
          </span>
        )}
      </div>
    </div>
  );
};
