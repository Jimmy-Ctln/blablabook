import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { BookCoverImage } from "@/components/BookCoverImage";
import { resizeOpenLibraryCover } from "@/lib/utils";

export default function BookCardCarousel({
  book,
}: {
  readonly book: BookDisplay;
}) {
  const card = (
    <Card className="flex flex-col rounded-lg h-full p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="w-full p-0 flex flex-col h-full">
        <div className="relative w-full aspect-3/4 overflow-hidden bg-muted">
          <BookCoverImage
            src={resizeOpenLibraryCover(book.cover_url || book.cover, "M")}
            alt={`Couverture de ${book.name}`}
            imgClassName="group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between bg-card">
          <div>
            <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
              {book.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {book.author || "Auteur inconnu"}
            </p>
          </div>

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

  if (!book.isbn) {
    return <div className="block h-full rounded-lg">{card}</div>;
  }

  return (
    <Link
      to="/books/$isbn"
      params={{ isbn: book.isbn }}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {card}
    </Link>
  );
}
