import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";

export default function BookCardCarousel({
  book,
}: {
  readonly book: BookDisplay;
}) {
  const router = useRouter();

  return (
    <Card
      className="flex flex-col rounded-lg h-full p-0 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
      onClick={() =>
        book.isbn &&
        router.navigate({
          to: "/books/$isbn",
          params: { isbn: book.isbn },
        })
      }
      role="article"
    >
      <CardContent className="w-full p-0 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-3/4 overflow-hidden bg-muted">
          <img
            src={book.cover_url || book.cover}
            alt={`Couverture de ${book.name}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Fallback if no image */}
          {!book.cover_url && !book.cover && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <div className="text-center px-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {book.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-3 flex-1 flex flex-col justify-between bg-card">
          <div>
            <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
              {book.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {book.author || "Auteur inconnu"}
            </p>
          </div>

          {/* Footer: Publisher + Category Tag */}
          <div className="flex items-center justify-between gap-2 mt-2">
            {book.publisher && (
              <p className="text-xs text-muted-foreground/70 line-clamp-1">
                {book.publisher}
              </p>
            )}
            {book.categories && book.categories.length > 0 && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md capitalize whitespace-nowrap">
                {book.categories[0]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
