import React from "react";

interface BookCoverProps {
  src: string;        
  alt: string;
  className?: string;  
}

export const BookCover: React.FC<BookCoverProps> = ({ src, alt, className }) => (
  <div className={`group relative w-full h-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-primary/40 hover:-translate-y-2 bg-gray-100 ${className}`}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 active:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center font-sans text-sm text-foreground">
          Pas d'image
        </div>
      )}
      
      <div className="absolute inset-0 bg-chart-2/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
        <div className="rounded-lg bg-background/10 backdrop-blur-md border border-background/20 p-2 shadow-sm">
          <h3 className="font-serif text-sm font-medium text-background text-center font-sans leading-tight">
            {alt}
          </h3>
        </div>
      </div>
    </div>
  
);