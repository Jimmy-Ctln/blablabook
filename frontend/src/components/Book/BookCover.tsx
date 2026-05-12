import React from "react";
import { BookCoverImage } from "@/components/BookCoverImage";

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ src, alt, className }) => (
  <div
    className={`group relative w-full h-full aspect-2/3 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-primary/40 hover:-translate-y-2 ${className ?? ""}`}
  >
    <BookCoverImage
      src={src}
      alt={alt}
      imgClassName="transition-transform duration-700 group-hover:scale-110 active:scale-110"
    />

    <div className="absolute inset-0 bg-chart-2/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-90" />

    <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
      <div className="rounded-lg bg-background/10 backdrop-blur-md border border-background/20 p-2 shadow-sm">
        <h3 className="text-sm font-medium text-background text-center leading-tight">
          {alt}
        </h3>
      </div>
    </div>
  </div>
);
