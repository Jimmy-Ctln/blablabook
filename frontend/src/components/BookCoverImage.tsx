import { useState } from "react";
import { Loader2 } from "lucide-react";

type BookCoverImageProps = {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

// Renders a book cover with a skeleton while loading and the app logo as
// fallback when the image is missing or fails to load.
export function BookCoverImage({ src, alt, className, imgClassName }: BookCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const showFallback = !src || error;

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      {!loaded && !showFallback && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground/50" />
        </div>
      )}

      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
          <img
            src="/book.svg"
            alt=""
            aria-hidden="true"
            className="w-12 h-12 opacity-25"
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName ?? ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
