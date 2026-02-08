import React from "react";

interface BookSummaryProps {
  description?: string;
}

// --- SUMMARY COMPONENT ---
export const BookSummary: React.FC<BookSummaryProps> = ({ description }) => {
  return (
    <div className="w-full pt-6 border-t border-border">
      <h3 className="text-xl text-foreground uppercase font-sans">Résumé</h3>
      <br />
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground font-sans leading-relaxed whitespace-pre-line">
        {description || (
          <span className="italic opacity-70">
            Aucune description fournie par l'éditeur.
          </span>
        )}
      </div>
    </div>
  );
};